<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class QualificationTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Must run after Qualification Type table has been seeded.
     *
     * @return void
     */
    public function run()
    {
        $crew_member_type = DB::table('crew_member_types')->where('name', 'pilot')->first();

        DB::table('qualification_types')->insert([
            'name' => "MQT",
            'crew_member_type_id' => $crew_member_type->name
        ]);

        DB::table('qualification_types')->insert([
            'name' => "FLUG",
            'crew_member_type_id' => $crew_member_type->name
        ]);

        DB::table('qualification_types')->insert([
            'name' => "MCC",
            'crew_member_type_id' => $crew_member_type->name
        ]);

        DB::table('qualification_types')->insert([
            'name' => "IP",
            'crew_member_type_id' => $crew_member_type->name
        ]);

        DB::table('qualification_types')->insert([
            'name' => "DI",
            'crew_member_type_id' => $crew_member_type->name
        ]);

        DB::table('qualification_types')->insert([
            'name' => "Evaluator",
            'crew_member_type_id' => $crew_member_type->name
        ]);

        $crew_member_type = DB::table('crew_member_types')->where('name', 'sensor operator')->first();

        DB::table('qualification_types')->insert([
            'name' => "ASC",
            'crew_member_type_id' => $crew_member_type->name
        ]);
    }
}
