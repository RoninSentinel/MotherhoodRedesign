<?php

namespace App\Http\Controllers;

use App\Models\Squadron;
use App\Http\Resources\SquadronResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SquadronController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Return all the squadrons.
        return response(SquadronResource::collection(Squadron::all(), 200));
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

        return response(new SquadronResource(Squadron::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    //public function show($id)
    public function show(Squadron $squadron)
    {
        return response(new SquadronResource($squadron), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Squadron $squadron)
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
    public function destroy(Squadron $squadron)
    {
        $squadron->delete();
        
        // May need to clean up additional database tables here.

        return response(null, 204);
    }
}
