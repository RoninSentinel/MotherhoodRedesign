<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use \DateTime;
//use Illuminate\Support\Str;

class ShiftTemplateInstanceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a single instance for testing purposes.
        $shift_template = DB::table('shift_templates')->where('squadron_id', 'Squadron 1')->first();
        $todays_date = new DateTime();

        DB::table('shift_template_instances')->insert([
            'shift_template_id' => $shift_template->id,
            'date' => $todays_date
        ]);
    }
}
