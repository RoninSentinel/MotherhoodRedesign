<?php

namespace App\Http\Controllers;

use App\Models\QualificationType;
use App\Http\Resources\QualificationTypeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QualificationTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: crew_member_type_id
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $crew_member_type_id = $request->query('crew_member_type_id');

        if (!empty($crew_member_type_id)) {
            $qualification_types = QualificationType::where('crew_member_type_id', $crew_member_type_id)->get();
            return response(QualificationTypeResource::collection($qualification_types, 200));
        } else {
            // Return all the crew member types.
            return response(QualificationTypeResource::collection(QualificationType::all(), 200));
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
            'name' => 'required',
            'crew_member_type_id' => 'required'
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new QualificationTypeResource(QualificationType::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(QualificationType $qualification_type)
    {
        return response(new QualificationTypeResource($qualification_type), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QualificationType $qualification_type)
    {
        $qualification_type->update($request->all());
        return response()->json($qualification_type, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(QualificationType $qualification_type)
    {
        $qualification_type->delete();
        return response(null, 204);
    }
}
