<?php

namespace App\Http\Controllers;

use App\Models\LineTemplate;
use App\Http\Resources\LineTemplateResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LineTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: None, squadron_id, is_active, name
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $squadron_name = $request->query('squadron_id');  
        $is_active = $request->query('is_active');
        $name = $request->query('name');

        if(!isset($squadron_name) and !isset($is_active) and !isset($name)) {
            // Return all the line templates.
            return response(LineTemplateResource::collection(LineTemplate::all(), 200));
        }

        // https://stackoverflow.com/questions/41322653/laravel-dynamic-where-queries-using-query-builder
        $line_templates = LineTemplate::query();

        if(isset($squadron_name)) {
            // https://laravel.io/forum/08-19-2014-case-insensitive-search-with-eloquent
            $line_templates->whereRaw('LOWER(`squadron_id`) LIKE ?', array($squadron_name));
        }

        if(isset($is_active)) { 
            $line_templates->where('is_active', $is_active);
        }

        if(isset($name)) {
            // https://laravel.io/forum/08-19-2014-case-insensitive-search-with-eloquent
            $line_templates->whereRaw('LOWER(`name`) LIKE ?', array($name));
        }

        return response(LineTemplateResource::collection($line_templates->get(), 200));
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
            'color' => 'required',
            'squadron_id' => 'required',
            'aor_id' => 'required'
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new LineTemplateResource(LineTemplate::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(LineTemplate $line_template)
    {
        return response(new LineTemplateResource($line_template), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LineTemplate $line_template)
    {
        $line_template->update($request->all());
        return response()->json($line_template, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(LineTemplate $line_template)
    {
        $line_template->delete();
        
        // May need to clean up additional database tables here.

        return response(null, 204);
    }
}
