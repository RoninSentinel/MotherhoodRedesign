<?php

namespace App\Http\Controllers;

use App\Models\CrewMemberShiftLineTimeBlocks;
use App\Http\Resources\CrewMemberShiftLineTimeBlocksResource;
use App\Http\Resources\ShiftTemplateInstanceResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\PublishBroadcastEvent;

class CrewMemberShiftLineTimeBlocksController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * Supported query parameters: crew_member_id OR shift_line_time_blocks
     *                             crew_member_id > shift_line_time_blocks
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $crew_member_id = $request->query('crew_member_id');
        $shift_line_time_block_id_list = $request->query('shift_line_time_blocks');
        
        if(empty($crew_member_id) and empty($shift_line_time_block_id_list) and empty($date)) {
            return response(CrewMemberShiftLineTimeBlocksResource::collection(CrewMemberShiftLineTimeBlocks::all(), 200));
        }

        $block_ids = explode(",", $shift_line_time_block_id_list);  // Converts the comma separated list string into an array.
        
        if(!empty($crew_member_id) and !empty($shift_line_time_block_id_list)) {
            $crew_member_shift_line_time_blocks = CrewMemberShiftLineTimeBlocks::where('crew_member_id', $crew_member_id)->whereIn('shift_line_time_block_id', $block_ids)->get();
            return response(CrewMemberShiftLineTimeBlocksResource::collection($crew_member_shift_line_time_blocks, 200));
 
        } elseif (!empty($crew_member_id)) {
            $crew_member_shift_line_time_blocks = CrewMemberShiftLineTimeBlocks::where('crew_member_id', $crew_member_id)->get();
            return response(CrewMemberShiftLineTimeBlocksResource::collection($crew_member_shift_line_time_blocks, 200));
        
        } elseif (!empty($crew_member_shift_line_time_blocks)) {
            $crew_member_shift_line_time_blocks = CrewMemberShiftLineTimeBlocks::whereIn('shift_line_time_block_id', $block_ids)->get();
            return response(CrewMemberShiftLineTimeBlocksResource::collection($crew_member_shift_line_time_blocks, 200));
        }

        return response()->json([
            'status' => "Error",
            'message' => "Required query parameters, if any are provided: crew_member_id OR shift_line_time_block_id."
        ], 400);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $new_crew_member_shift_line_time_blocks = array();
        $data = $request->getContent();
        $crew_member_shift_line_time_blocks = json_decode($data, true);

        foreach($crew_member_shift_line_time_blocks as $crew_member_shift_line_time_block) {
            $validate = Validator::make($crew_member_shift_line_time_block, [
                'shift_line_time_block_id' => 'required',
                'position' => 'required',
            ]);

            if($validate->fails()) {
                return response($validate->errors(), 400);
            }

            array_push($new_crew_member_shift_line_time_blocks, CrewMemberShiftLineTimeBlocks::create($crew_member_shift_line_time_block));
        }

        return response(CrewMemberShiftLineTimeBlocksResource::collection($new_crew_member_shift_line_time_blocks, 201));

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(CrewMemberShiftLineTimeBlocks $crew_member_shift_line_time_block)
    {
        // Must find alternative way to access single record, due to composite key.
        return response()->json([
            'status' => "Error",
            'message' => "Access restricted."
        ], 400);
    }

    /**
     * Update the specified resource in storage.
     *
     * Expected JSON format example: [{"_date": "2020-12-02", "_squadron": "Squadron 1", "_shift": "Days", "data": [{"id":1,"crew_member_id":1,"shift_line_time_block_id":1,"position":0}]}]
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CrewMemberShiftLineTimeBlocks $crew_member_shift_line_time_block)
    {
        $crew_member_shift_line_time_block->update($request->all());
        return response()->json($crew_member_shift_line_time_block, 200);

    }

    public function batch_update(Request $request) {        
        $updated_crew_member_shift_line_time_blocks = array();
        $content = json_decode($request->getContent(), true);

        // Meta data for the event listener.
        $uuid = $content['_uuid'];
        $date = $content['_date'];
        $squadron = $content['_squadron'];
        $shift = $content['_shift'];

        // Actual information to be saved to the database.
        $data = $content['data'];
        $crew_member_shift_line_time_blocks = $data;

        foreach($crew_member_shift_line_time_blocks as $crew_member_shift_line_time_block) {
            $validate = Validator::make($crew_member_shift_line_time_block, [
                'shift_line_time_block_id' => 'required',
                'position' => 'required',
            ]);

            if($validate->fails()) {
                return response($validate->errors(), 400);
            }
        }

        // Only update if validation passes on ALL records being updated...all or nothing.
        foreach($crew_member_shift_line_time_blocks as $crew_member_shift_line_time_block) {
            // https://stackoverflow.com/questions/25195010/json-decode-returning-error-notice-trying-to-get-property-of-non-object
            $time_block_to_update = CrewMemberShiftLineTimeBlocks::find($crew_member_shift_line_time_block['id']);
            $time_block_to_update->fill($crew_member_shift_line_time_block);
            $time_block_to_update->save();
            array_push($updated_crew_member_shift_line_time_blocks, $time_block_to_update);
        }

        // Laravel will strip the joined query results after constructing the event if only the $dataToBroadcast is used to set $data,
        // so the workaround is to construct the entire response and then use the body content.
        $shift_template = ShiftTemplateController::getActiveShiftTemplate($shift, $squadron);
        $shift_template_instance = ShiftTemplateInstanceController::getShiftTemplateInstancesWithDate($date, $shift_template->id);
        //$dataToBroadcast = $this->getCrewMemberShiftLineTimeBlocksWithJoins($date, $squadron, $shift);
        $response = response(new ShiftTemplateInstanceResource($shift_template_instance, 200));
        event(new PublishBroadcastEvent($uuid, $date, $shift, $squadron, "ShiftTemplateInstances", $response->getContent()));

        return response(CrewMemberShiftLineTimeBlocksResource::collection($updated_crew_member_shift_line_time_blocks, 200));
    
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(CrewMemberShiftLineTimeBlocks $crew_member_shift_line_time_block)
    {
        // If delete required, consider refactoring to remove the composite key on table.
        return response()->json([
            'status' => "Error",
            'message' => "Resource cannot be deleted."
        ], 400);
    }

    public function batch_delete(Request $request) {  
        $data = $request->getContent();
        $crew_member_shift_line_time_block_ids = json_decode($data, true);
        CrewMemberShiftLineTimeBlocks::destroy($crew_member_shift_line_time_block_ids);
        
        return response(null, 204);
    }

}
