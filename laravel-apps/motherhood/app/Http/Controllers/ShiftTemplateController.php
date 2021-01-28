<?php

namespace App\Http\Controllers;

use App\Models\ShiftTemplate;
use App\Http\Resources\ShiftTemplateResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShiftTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: squadron_id, shift_name, is_active
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $shift_name = $request->query('shift_name');
        $is_active = $request->query('is_active');
        $squadron_name = $request->query('squadron_id');

        if(!isset($squadron_name) and !isset($is_active) and !isset($shift_name)) {
            // Return all the shift templates.
            return response(ShiftTemplateResource::collection(ShiftTemplate::all(), 200));
        }

        $shift_templates = ShiftTemplate::query();
        if(isset($squadron_name)) {
            // https://laravel.io/forum/08-19-2014-case-insensitive-search-with-eloquent
            $shift_templates->whereRaw('LOWER(`squadron_id`) LIKE ?', array($squadron_name));
        }

        if(isset($is_active)) { 
            $shift_templates->where('is_active', $is_active);
        }

        if(isset($shift_name)) {
            // https://laravel.io/forum/08-19-2014-case-insensitive-search-with-eloquent
            $shift_templates->whereRaw('LOWER(`name`) LIKE ?', array($shift_name));
        }

        return response(ShiftTemplateResource::collection($shift_templates->get(), 200));

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
            'name' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'total_hours' => 'required',
            'squadron_id' => 'required',
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new ShiftTemplateResource(ShiftTemplate::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ShiftTemplate $shift_template)
    {
        return response(new ShiftTemplateResource($shift_template), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ShiftTemplate $shift_template)
    {
        $shift_template->update($request->all());
        return response()->json($shift_template, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShiftTemplate $shift_template)
    {
        $shift_template->delete();
        
        // May need to clean up additional database tables here.

        return response(null, 204);
    }

    public static function getActiveShiftTemplate($shift_name, $squadron_name)
    {
        $is_active = true;

        $shift_templates = ShiftTemplate::query()
                                        ->whereRaw('LOWER(`squadron_id`) LIKE ?', array($squadron_name))
                                        ->where('is_active', $is_active)
                                        ->whereRaw('LOWER(`name`) LIKE ?', array($shift_name));
        return $shift_templates->first();
    }
}
