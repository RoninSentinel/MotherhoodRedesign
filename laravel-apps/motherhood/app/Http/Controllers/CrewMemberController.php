<?php

namespace App\Http\Controllers;

use App\Models\CrewMember;
use App\Http\Resources\CrewMemberResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CrewMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: squadron_id OR crew_members OR last_name OR call_sign (can only filter on one parameter currently)
     *                             Does not currently support flight parameter.
     *                             If squadron_id is used as a query parameter, team and flight information for each crew member will be attached.
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $squadron_name = $request->query('squadron_id');
        $crew_members = $request->query('crew_members');
        $last_name = $request->query('last_name');
        $call_sign = $request->query('call_sign');

        if(empty($squadron_name) and empty($crew_members) and empty($last_name) and empty($call_sign)) {
            // Return all the shift template instances.
            return response(CrewMemberResource::collection(CrewMember::all(), 200));

        }

        if (!empty($squadron_name)) {
            //$crew_member_with_squadron = CrewMember::where('squadron_id', $squadron_name)->get();
            $crew_member_with_squadron = CrewMember::whereRaw('LOWER(`crew_members`.`squadron_id`) LIKE ?', array($squadron_name))
                                                     ->get();
                                                    //->leftJoin('flights', 'crew_members.flight_id', '=', 'flights.id')
                                                    //->leftJoin('teams', 'teams.id', '=', 'flights.team_id')
                                                    //->get(['crew_members.*', 'flights.name AS flight_name', 'teams.name AS team_name']);
            return response(CrewMemberResource::collection($crew_member_with_squadron, 200));

        } elseif (!empty($crew_members)) {
            $crew_member_ids = explode(",", $crew_members);  // Converts the comma separated list string into an array.
            $crew_member_with_ids = CrewMember::whereIn('id', $crew_member_ids)->get();
            return response(CrewMemberResource::collection($crew_member_with_ids, 200));

        } elseif (!empty($last_name)) {
            $crew_member_with_last_name = CrewMember::whereRaw('LOWER(`last_name`) LIKE ?', array($last_name))->get();
            return response(CrewMemberResource::collection($crew_member_with_last_name, 200));

        } else {
            // Assumes $call_sign is not empty.
            $crew_member_with_call_sign = CrewMember::whereRaw('LOWER(`call_sign`) LIKE ?', array($call_sign))->get();
            return response(CrewMemberResource::collection($crew_member_with_call_sign, 200));
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
            'last_name' => 'required',
            'squadron_id' => 'required',
            'crew_member_type_id' => 'required',
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new CrewMemberResource(CrewMember::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    //public function show($id)
    public function show(CrewMember $crew_member)
    {
        //return response($crew_member, 200);
        return response(new CrewMemberResource($crew_member), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CrewMember $crew_member)
    {
        $crew_member->update($request->all());
        // Laravel does not update the additional models (i.e. Flight) included via "protected with", if a fresh crew_member isn't pulled from database.
        $crew_member = CrewMember::where('id', $crew_member->id)->get();
        return response()->json($crew_member, 200);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    //public function destroy($id)
    public function destroy(CrewMember $crew_member)
    {
        $crew_member->delete();
        
        // May need to clean up additional database tables here.

        return response(null, 204);
    }
}
