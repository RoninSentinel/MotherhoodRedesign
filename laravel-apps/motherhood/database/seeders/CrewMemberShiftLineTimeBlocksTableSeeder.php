<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class CrewMemberShiftLineTimeBlocksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $crew_member = DB::table('crew_members')->first();
        $shift_line_time_block = DB::table('shift_line_time_blocks')->first();

        DB::table('crew_member_shift_line_time_blocks')->insert([
            'crew_member_id' => $crew_member->id,
            'shift_line_time_block_id' => $shift_line_time_block->id,
            'position' => 1  // Assumes 1 = Pilot, 2 = Sensor Operator, 3+ = instructor, additional crew members.
        ]);
    }
}
