<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class ShiftTemplateTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Create a days, swings, mids shift for each squadron based on current known schedule.
     * 
     * Must run after Squadron table has been seeded.
     * 
     * @return void
     */
    public function run()
    {
        // 15 ATKS Day shift.
        $squadron = DB::table('squadrons')->where('name', '15ATKS')->first();

        $day_shift_start_time = Date("15:30:00");
        $day_shift_end_time = Date("23:30:00");

        DB::table('shift_templates')->insert([
            'name' => "Days",
            'start_time' => $day_shift_start_time,
            'end_time' => $day_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 15 ATKS Swings shift.
        $swing_shift_start_time = Date("23:30:00");
        $swing_shift_end_time = Date("07:30:00");

        DB::table('shift_templates')->insert([
            'name' => "Swings",
            'start_time' => $swing_shift_start_time,
            'end_time' => $swing_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 15 ATKS Mids shift.
        $mid_shift_start_time = Date("07:30:00");
        $mid_shift_end_time = Date("15:30:00");

        DB::table('shift_templates')->insert([
            'name' => "Mids",
            'start_time' => $mid_shift_start_time,
            'end_time' => $mid_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        /////////////////////////////////////////////////////////////////////////////////////////
        // 17 ATKS Day shift.

        $squadron = DB::table('squadrons')->where('name', '17ATKS')->first();

        $day_shift_start_time = Date("16:00:00");
        $day_shift_end_time = Date("00:00:00");

        DB::table('shift_templates')->insert([
            'name' => "Days",
            'start_time' => $day_shift_start_time,
            'end_time' => $day_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 17 ATKS Swings shift.
        $swing_shift_start_time = Date("00:00:00");
        $swing_shift_end_time = Date("08:00:00");

        DB::table('shift_templates')->insert([
            'name' => "Swings",
            'start_time' => $swing_shift_start_time,
            'end_time' => $swing_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 17 ATKS Mids shift.
        $mid_shift_start_time = Date("08:00:00");
        $mid_shift_end_time = Date("16:00:00");

        DB::table('shift_templates')->insert([
            'name' => "Mids",
            'start_time' => $mid_shift_start_time,
            'end_time' => $mid_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        /////////////////////////////////////////////////////////////////////////////////////////
        // 22 ATKS Day shift.

        $squadron = DB::table('squadrons')->where('name', '22ATKS')->first();

        $day_shift_start_time = Date("16:00:00");
        $day_shift_end_time = Date("00:00:00");

        DB::table('shift_templates')->insert([
            'name' => "Days",
            'start_time' => $day_shift_start_time,
            'end_time' => $day_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 22 ATKS Swings shift.
        $swing_shift_start_time = Date("00:00:00");
        $swing_shift_end_time = Date("08:00:00");

        DB::table('shift_templates')->insert([
            'name' => "Swings",
            'start_time' => $swing_shift_start_time,
            'end_time' => $swing_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 22 ATKS Mids shift.
        $mid_shift_start_time = Date("08:00:00");
        $mid_shift_end_time = Date("16:00:00");

        DB::table('shift_templates')->insert([
            'name' => "Mids",
            'start_time' => $mid_shift_start_time,
            'end_time' => $mid_shift_end_time,
            'total_hours' => 8.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        /////////////////////////////////////////////////////////////////////////////////////////

        // 867th ATKS Day shift.
        $squadron = DB::table('squadrons')->where('name', '867ATKS')->first();

        $day_shift_start_time = Date("15:30:00");
        $day_shift_end_time = Date("00:00:00");

        DB::table('shift_templates')->insert([
            'name' => "Days",
            'start_time' => $day_shift_start_time,
            'end_time' => $day_shift_end_time,
            'total_hours' => 8.5,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 867th ATKS Swings shift.
        $swing_shift_start_time = Date("00:00:00");
        $swing_shift_end_time = Date("08:30:00");

        DB::table('shift_templates')->insert([
            'name' => "Swings",
            'start_time' => $swing_shift_start_time,
            'end_time' => $swing_shift_end_time,
            'total_hours' => 8.5,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        // 867th ATKS Mids shift.
        $mid_shift_start_time = Date("08:30:00");
        $mid_shift_end_time = Date("15:30:00");

        DB::table('shift_templates')->insert([
            'name' => "Mids",
            'start_time' => $mid_shift_start_time,
            'end_time' => $mid_shift_end_time,
            'total_hours' => 7.0,
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);
    }
}
