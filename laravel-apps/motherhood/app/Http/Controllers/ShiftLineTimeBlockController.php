<?php

namespace App\Http\Controllers;

use App\Models\ShiftLineTimeBlock;
use App\Http\Resources\ShiftLineTimeBlockResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShiftLineTimeBlockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: line_instance_id
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $line_instance_id = $request->query('line_instance_id');

        if(empty($line_instance_id)) {
            // Return all the shift template instances.
            return response(ShiftLineTimeBlockResource::collection(ShiftLineTimeBlock::all(), 200));
        }

        $shift_line_time_blocks = ShiftLineTimeBlock::where('line_instance_id', $line_instance_id)->get();
        return response(ShiftLineTimeBlockResource::collection($shift_line_time_blocks, 200));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $new_shift_line_time_blocks = array();
        $data = $request->getContent();
        $shift_line_time_blocks = json_decode($data, true);

        foreach($shift_line_time_blocks as $shift_line_time_block) {
            $validate = Validator::make($shift_line_time_block, [
                'line_instance_id' => 'required',
                'start_time' => 'required',
                'end_time' => 'required',
                'position' => 'required',

            ]);

            if($validate->fails()) {
                return response($validate->errors(), 400);
            }

            array_push($new_shift_line_time_blocks, ShiftLineTimeBlock::create($shift_line_time_block));
        }

        return response(ShiftLineTimeBlockResource::collection($new_shift_line_time_blocks, 201));

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ShiftLineTimeBlock $shift_line_time_block)
    {
        return response(new ShiftLineTimeBlockResource($shift_line_time_block), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ShiftLineTimeBlock $shift_line_time_block)
    {
        $shift_line_time_block->update($request->all());
        return response()->json($shift_line_time_block, 200);
    }

    public function batch_update(Request $request) {        
        $updated_shift_line_time_blocks = array();
        $data = $request->getContent();
        $shift_line_time_blocks = json_decode($data, true);

        //foreach($shift_line_time_blocks as $shift_line_time_block) {
        //    $validate = Validator::make($shift_line_time_block, [
        //        'line_instance_id' => 'required',
        //    ]);

        //    if($validate->fails()) {
        //        return response($validate->errors(), 400);
        //    }
        //}

        // Only update if validation passes on ALL records being updated...all or nothing.
        foreach($shift_line_time_blocks as $shift_line_time_block) {
            // https://stackoverflow.com/questions/25195010/json-decode-returning-error-notice-trying-to-get-property-of-non-object
            $time_block_to_update = ShiftLineTimeBlock::find($shift_line_time_block['id']);
            $time_block_to_update->fill($shift_line_time_block);
            $time_block_to_update->save();
            array_push($updated_shift_line_time_blocks, $shift_line_time_block);
        }

        return response(ShiftLineTimeBlockResource::collection($updated_shift_line_time_blocks, 200));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShiftLineTimeBlock $shift_line_time_block)
    {
        $shift_line_time_block->delete();
        
        // May need to clean up additional database tables here.

        return response(null, 204);
    }

    public function batch_delete(Request $request) {  
        $data = $request->getContent();
        $shift_line_time_block_ids = json_decode($data, true);
        ShiftLineTimeBlock::destroy($shift_line_time_block_ids);
        
        return response(null, 204);
    }
}
