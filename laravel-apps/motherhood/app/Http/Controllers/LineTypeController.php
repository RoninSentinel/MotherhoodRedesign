<?php

namespace App\Http\Controllers;

use App\Models\LineType;
use App\Http\Resources\LineTypeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LineTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Return all the line types.
        return response(LineTypeResource::collection(LineType::all(), 200));
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

        return response(new LineTypeResource(LineType::create($validate->validate())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(LineType $line_type)
    {
        return response(new LineTypeResource($line_type), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LineType $line_type)
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
    public function destroy(LineType $line_type)
    {
        $line_type->delete();
        return response(null, 204);
    }
}
