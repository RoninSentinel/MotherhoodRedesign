<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class QualificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a single qualification for a single pilot for testing purposes.
        $crew_member = DB::table('crew_members')->where('last_name', 'Paetz')->first();
        $qualification_type = DB::table('qualification_types')->where('name', 'FLUG')->first();

        DB::table('qualifications')->insert([
            'crew_member_id' => $crew_member->id,
            'qualification_type_id' => $qualification_type->id
        ]);
    }
}
