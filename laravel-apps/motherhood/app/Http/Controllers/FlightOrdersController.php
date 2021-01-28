<?php

namespace App\Http\Controllers;

use App\Models\FlightOrders;
use App\Http\Resources\FlightOrdersResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\PublishBroadcastEvent;

class FlightOrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Supported query parameters: date (YYYY-MM-DD) OR shift_template_instance_id
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $shift_date = $request->query('date');
        $shift_template_instance_id = $request->query('shift_template_instance_id');

        if(empty($shift_date) and empty($shift_template_instance_id)) {
            return response(FlightOrdersResource::collection(FlightOrders::all(), 200));
        }

        if(!empty($shift_date) and !empty($shift_template_instance_id)) {
            $flight_orders = FlightOrders::where('date', $shift_date)
                                         ->where('shift_template_instance_id', $shift_template_instance_id)
                                         ->get();
            return response(FlightOrdersResource::collection($flight_orders, 200));
        }       

        if (!empty($shift_date)) {
            $flight_orders = FlightOrders::where('date', $shift_date)->get();
        } else {
            $flight_orders = FlightOrders::where('shift_template_instance_id', $shift_template_instance_id)->get();
        }

        return response(FlightOrdersResource::collection($flight_orders, 200));

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
            'crew_member_id' => 'required',
            'date' => 'required',
            'shift_template_instance_id' => 'required'
        ]);

        if($validate->fails()) {
            return response($validate->errors(), 400);
        }

        return response(new FlightOrdersResource(FlightOrders::create($request->all())), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(FlightOrders $flight_order)
    {
        return response(new FlightOrdersResource($flight_order), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FlightOrders $flight_order)
    {
        $flight_order->update($request->all());
        return response()->json($flight_order, 200);
    }

    /** 
     * 
     * Updates or creates flight orders.
     * 
    */
    public function batch_update(Request $request) {
        $updated_flight_orders = array();
        $content = json_decode($request->getContent(), true);

        // Meta data for the event listener.
        $uuid = $content['_uuid'];
        $date = $content['_date'];
        $squadron = $content['_squadron'];
        $shift = $content['_shift'];

        // Actual information to be saved to the database.
        $data = $content['data'];
        $flight_orders = $data;

        $shift_template_instance_id = 0;
        foreach($flight_orders as $flight_order) {
            $validate = Validator::make($flight_order, [
                'crew_member_id' => 'required',
                'date' => 'required',
                'shift_template_instance_id' => 'required'
            ]);
    
            if($validate->fails()) {
                return response($validate->errors(), 400);
            }
            $shift_template_instance_id = $flight_order['shift_template_instance_id'];
        }

        foreach($flight_orders as $flight_order) {
            // https://stackoverflow.com/questions/25195010/json-decode-returning-error-notice-trying-to-get-property-of-non-object
            $flight_order_to_update = FlightOrders::where('crew_member_id', $flight_order['crew_member_id'])
                                                  ->where('date', $flight_order['date'])
                                                  ->where('shift_template_instance_id', $flight_order['shift_template_instance_id'])
                                                  ->first();
            
            if($flight_order_to_update === null) {
                // New instance.
                $flight_order_to_update = new FlightOrders();
            } 

            $flight_order_to_update->fill($flight_order);
            $flight_order_to_update->save();
            array_push($updated_flight_orders, $flight_order_to_update);
        }

        $dataToBroadcast = FlightOrders::where('date', $date)
                                       ->where('shift_template_instance_id', $shift_template_instance_id)
                                       ->get();
        $response = response(FlightOrdersResource::collection($dataToBroadcast, 200));
        event(new PublishBroadcastEvent($uuid, $date, $shift, $squadron, "FlightOrders", $response->getContent()));

        return response(FlightOrdersResource::collection($updated_flight_orders, 201));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(FlightOrders $flight_order)
    {
        $flight_order->delete();

        return response(null, 204);
    }

    public function batch_delete(Request $request) {  
        $data = $request->getContent();
        $flight_order_ids = json_decode($data, true);

        FlightOrders::destroy($flight_order_ids);
        
        return response(null, 204);
    }

}
