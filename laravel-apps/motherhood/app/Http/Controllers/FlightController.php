<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use App\Http\Resources\FlightResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FlightController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: team_id, squadron_id (can only filter on one at a time - squadron_id takes priority)
     *                             Querying on squadron_id will return team name as well.
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $squadron_id = $request->query('squadron_id');
        $team_id = $request->query('team_id');

        if(empty($team_id) && empty($squadron_id)) {
            // Return all the shift template instances.
            return response(FlightResource::collection(Flight::all(), 200));
        }

        if (!empty($squadron_id)) {
            $flights_with_squadron = Flight::whereRaw('LOWER(`flights`.`squadron_id`) LIKE ?', array($squadron_id))
                                            ->leftJoin('teams', 'teams.id', '=', 'flights.team_id')
                                            ->get(['flights.*', 'teams.name AS team_name']);
            return response(FlightResource::collection($flights_with_squadron, 200));

        } else {
            $flights_with_team = Flight::whereRaw('LOWER(`team_id`) LIKE ?', array($team_id))->get();
            return response(FlightResource::collection($flights_with_team, 200));
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
            'squadron_id' => 'required',
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new FlightResource(Flight::create($request->all())), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Flight $flight)
    {
        return response(new FlightResource($flight), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Flight $flight)
    {
        $flight->update($request->all());
        return response()->json($flight, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Flight $flight)
    {
        $flight->delete();
        return response(null, 204);
    }
}
