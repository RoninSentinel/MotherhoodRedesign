<?php

namespace App\Http\Controllers;

use App\Models\AdminToken;
use App\Http\Resources\AdminTokenResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminTokenController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * Supported query parameters: squadron_id, code, is_active
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $squadron_name = $request->query('squadron_id');
        $code = $request->query('code');
        $is_active = $request->query('is_active');

        if(empty($code) and empty($squadron_name) and empty($is_active)) {
            // Return all the admin tokens.
            return response(AdminTokenResource::collection(AdminToken::all(), 200));
        }

        // https://stackoverflow.com/questions/41322653/laravel-dynamic-where-queries-using-query-builder
        $admin_tokens = AdminToken::query();

        if(isset($squadron_name)) {
            // https://laravel.io/forum/08-19-2014-case-insensitive-search-with-eloquent
            $admin_tokens->whereRaw('LOWER(`squadron_id`) LIKE ?', array($squadron_name));
        }

        if(isset($is_active)) { 
            $admin_tokens->where('is_active', $is_active);
        }

        if(isset($code)) {
            $admin_tokens->where('code', $code);
        }

        return response(AdminTokenResource::collection($admin_tokens->get(), 200));
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
            'code' => 'required',
            'access_level' => 'required',
            'squadron_id' => 'required',
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new AdminTokenResource(AdminToken::create($request->all())), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(AdminToken $admin_token)
    {
        return response(new AdminTokenResource($admin_token), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AdminToken $admin_token)
    {
        $admin_token->update($request->all());
        return response()->json($admin_token, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(AdminToken $admin_token)
    {
        {
            $admin_token->delete();
            return response(null, 204);
        }
    }
}
