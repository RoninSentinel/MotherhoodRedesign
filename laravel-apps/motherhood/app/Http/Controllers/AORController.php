<?php

namespace App\Http\Controllers;

use App\Models\AOR;
use App\Http\Resources\AORResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AORController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Return all the AORs.
        return response(AORResource::collection(AOR::all(), 200));
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

        return response(new AORResource(AOR::create($validate->validate())), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(AOR $aor)
    {
        return response(new AORResource($aor), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AOR $aor)
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
    public function destroy(AOR $aor)
    {
        $aor->delete();
        return response(null, 204);
    }
}
