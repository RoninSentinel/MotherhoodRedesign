<?php

namespace App\Http\Controllers;

use App\Models\LineInstance;
use App\Http\Resources\LineInstanceResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LineInstanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: None 
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return response(LineInstanceResource::collection(LineInstance::all(), 200));
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
            'line_template_id' => 'required',
            'shift_template_instance_id' => 'required',
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new LineInstanceResource(LineInstance::create($request->all())), 201);
    }

    public function batch_create(Request $request)
    {
        $new_line_instances = array();
        $data = $request->getContent();
        $line_instances = json_decode($data, true);

        foreach($line_instances as $line_instance) {
            $validate = Validator::make($line_instance, [
                'line_template_id' => 'required',
                'shift_template_instance_id' => 'required',
            ]);
    
            if($validate->fails()) {
                return response($validate->errors(), 400);
            }

            array_push($new_line_instances, LineInstance::create($line_instance));
        }

        return response(LineInstanceResource::collection($new_line_instances, 201));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(LineInstance $line_instance)
    {
        return response(new LineInstanceResource($line_instance), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LineInstance $line_instance) 
    {
        $line_instance->update($request->all());
        return response()->json($line_instance, 200);
    }

    public function batch_update(Request $request) {
        $data = $request->getContent();
        return response()->json([], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(LineInstance $line_instance)
    {
        $line_instance->delete();
        return response(null, 204);
    }

    public function batch_delete(Request $request) {  
        $data = $request->getContent();
        $line_instance_ids = json_decode($data, true);
        LineInstance::destroy($line_instance_ids);
        
        return response(null, 204);
    }
}
