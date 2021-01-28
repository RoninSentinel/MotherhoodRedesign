<?php

namespace App\Http\Controllers;

use App\Models\Qualifications;
use App\Http\Resources\QualificationsResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QualificationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: crew_members (a single or comma delimited list of ids), qualification_type_id
     *                             Using crew_members as a query parameter will include the qualification type name (join).
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $crew_member_id_list = $request->query('crew_members');
        $qualification_type_id = $request->query('qualification_type_id');

        if(empty($crew_member_id_list) and empty($qualification_type_id)) {
            return response(QualificationsResource::collection(Qualifications::all(), 200));
        }

        $crew_member_ids = explode(",", $crew_member_id_list);  // Converts the comma separated list string into an array.

        if(!empty($crew_member_id_list) and !empty($qualification_type_id)) {
            $qualifications = Qualifications::whereIn('crew_member_id', $crew_member_ids)->where('qualification_type_id', $qualification_type_id)->get();
            return response(QualificationsResource::collection($qualifications, 200));
 
        } elseif (!empty($crew_member_id_list)) {
            $qualifications_with_type_name = Qualifications::whereIn('qualifications.crew_member_id', $crew_member_ids)
                                                             ->leftJoin('qualification_types', 'qualification_types.id', '=', 'qualifications.qualification_type_id')
                                                             ->get(['qualifications.*', 'qualification_types.name AS qualification_name']);
            return response(QualificationsResource::collection($qualifications_with_type_name, 200));
        } else {
            // qualification_type_id is not empty.
            $qualifications = Qualifications::where('qualification_type_id', $qualification_type_id)->get();
            return response(QualificationsResource::collection($qualifications, 200));
        }

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
            'crew_member_id' => 'required',
            'qualification_type_id' => 'required'
        ]);

        return response(new QualificationsResource(Qualifications::create($validate->validate())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Qualifications $qualification)
    {
        return response(new QualificationsResource($qualification), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Qualifications $qualification)
    {
        $qualification->update($request->all());
        return response()->json($qualification, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Qualifications $qualification)
    {
        $qualification->delete();
        return response(null, 204);
    }
}
