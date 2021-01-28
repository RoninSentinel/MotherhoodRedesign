<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use \DateTime;

class FlightOrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a single instance for testing purposes.
        $crew_member = DB::table('crew_members')->first();
        $todays_date = new DateTime();
        $shift_template_instance = DB::table('shift_template_instances')->first();

        DB::table('flight_orders')->insert([
            'crew_member_id' => $crew_member->id,
            'date' => $todays_date,
            'shift_template_instance_id' => $shift_template_instance->id,
            'total_hours_scheduled' => 0
        ]);
    }
}
