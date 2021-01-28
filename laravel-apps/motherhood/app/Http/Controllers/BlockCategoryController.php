<?php

namespace App\Http\Controllers;

use App\Models\BlockCategory;
use App\Http\Resources\BlockCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlockCategoryController extends Controller
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
        $squadron_name = $request->query('squadron_id');

        if(empty($squadron_name)) {
            // Return all the shift template instances.
            return response(BlockCategoryResource::collection(BlockCategory::all(), 200));
        }

        $block_categories = BlockCategory::query();
        $block_categories->whereRaw('LOWER(`squadron_id`) LIKE ?', array($squadron_name))
                         ->orderBy('short_name');
        
        return response(BlockCategoryResource::collection($block_categories->get(), 200));
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
            'short_name' => 'required',
            'color' => 'required',
            'squadron_id' => 'required',
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new BlockCategoryResource(BlockCategory::create($request->all())), 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(BlockCategory $block_category)
    {
        return response(new BlockCategoryResource($block_category), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BlockCategory $block_category)
    {
        $block_category->update($request->all());
        return response()->json($block_category, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(BlockCategory $block_category)
    {
        $block_category->delete();
        return response(null, 204);
    }
}
