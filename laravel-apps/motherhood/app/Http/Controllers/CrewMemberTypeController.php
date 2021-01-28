<?php

namespace App\Http\Controllers;

use App\Models\CrewMemberType;
use App\Http\Resources\CrewMemberTypeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CrewMemberTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Return all the crew member types.
        return response(CrewMemberTypeResource::collection(CrewMemberType::all(), 200));
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
            'name' => 'required'
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new CrewMemberTypeResource(CrewMemberType::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(CrewMemberType $crew_member_type)
    {
        return response(new CrewMemberTypeResource($crew_member_type), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CrewMemberType $crew_member_type)
    {
        return response()->json([
            'status' => "Error",
            'message' => "Resource cannot be updated."
        ], 400);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(CrewMemberType $crew_member_type)
    {
        $crew_member_type->delete();
        
        // May need to clean up additional database tables here.

        return response(null, 204);
    }
}
