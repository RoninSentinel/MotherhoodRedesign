<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class CrewMemberTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('crew_member_types')->insert([
            'name' => "pilot"
        ]);

        DB::table('crew_member_types')->insert([
            'name' => "sensor operator"
        ]);
    }
}
