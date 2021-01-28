<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\LineInstance;
use App\Models\LineTemplate;
use \DateInterval;
//use Illuminate\Support\Str;

class ShiftLineTimeBlockTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Seed for testing purposes.
        $id = 1;
        $line_instance = LineInstance::find($id); 
        $block_category = DB::table('block_categories')->where('name', 'presets')->first();

        $minutes_to_add = 30;
        $initial_time = $line_instance->shiftTemplateInstance->shiftTemplate->start_time;
        $position = 1;
        
        $block_start_time = clone $initial_time;
        $block_end_time = $initial_time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
        
        for ($x = 0; $x < 10; $x++) {
            // Refactor: create a time block for entire line/entire shift.
            DB::table('shift_line_time_blocks')->insert([
                'line_instance_id' => $line_instance->id,
                'start_time'=> $block_start_time,
                'end_time' => $block_end_time,
                'position' => $position,
                'mission_number' => 1234,
                'block_category_id' => $block_category->id
            ]);

            $position++;
            $block_start_time = clone $block_end_time;
            $block_end_time = $initial_time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
        }
    }
}
