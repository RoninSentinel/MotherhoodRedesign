<?php

namespace App\Http\Controllers;

use App\Models\ShiftTemplateInstance;
use App\Http\Resources\ShiftTemplateInstanceResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShiftTemplateInstanceController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * Required query parameters if any provided: date (YYYY-MM-DD), shift_template_id
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $shift_date = $request->query('date');
        $shift_template_id = $request->query('shift_template_id');

        if(empty($shift_date) and empty($shift_template_id)) {
            return response(ShiftTemplateInstanceResource::collection(ShiftTemplateInstance::all(), 200));
        }

        if(!empty($shift_date) and !empty($shift_template_id)) {

            $shift_templates = ShiftTemplateInstance::where('date', $shift_date)->where('shift_template_id', $shift_template_id)->get();
            return response(ShiftTemplateInstanceResource::collection($shift_templates, 200));
 
        }

        return response()->json([
            'status' => "Error",
            'message' => "Required query parameters, if any are provided: date (YYYY-MM-DD), shift_template_id."
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
        $validate = Validator::make($request->toArray(), [
            'shift_template_id' => 'required',
            'date' => 'required'
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new ShiftTemplateInstanceResource(ShiftTemplateInstance::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ShiftTemplateInstance $shift_template_instance)
    {
        return response(new ShiftTemplateInstanceResource($shift_template_instance), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ShiftTemplateInstance $shift_template_instance)
    {
        $shift_template_instance->update($request->all());
        return response()->json($shift_template_instance, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShiftTemplateInstance $shift_template_instance)
    {
        $shift_template_instance->delete();
        
        // May need to clean up additional database tables here.

        return response(null, 204);
    }

    public static function getShiftTemplateInstancesWithDate($date, $shift_template_id)
    {
        $shift_template_instances = ShiftTemplateInstance::query()
                                        ->where('date', $date)
                                        ->where('shift_template_id', $shift_template_id);
        return $shift_template_instances->first();
    }

}
