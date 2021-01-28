<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Http\Resources\TeamResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: squadron_id
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $squadron_id = $request->query('squadron_id');

        if(empty($squadron_id)) {
            // Return all the shift template instances.
            return response(TeamResource::collection(Team::all(), 200));
        }

        $teams = Team::whereRaw('LOWER(`squadron_id`) LIKE ?', array($squadron_id))->get();
        //where('squadron_id', $squadron_id)->get();
        return response(TeamResource::collection($teams, 200));
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
            'squadron_id' => 'required',
        ]);

        return response(new TeamResource(Team::create($validate->validate())), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Team $team)
    {
        return response(new TeamResource($team), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Team $team)
    {
        $team->update($request->all());
        return response()->json($team, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Team $team)
    {
        $team->delete();
        return response(null, 204);
    }
}
