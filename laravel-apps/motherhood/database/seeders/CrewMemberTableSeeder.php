<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Squadron;
use App\Models\CrewMemberType;

use Faker\Factory as Faker;
//use Illuminate\Support\Str;

class CrewMemberTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $squadron = DB::table('squadrons')->where('name', '732OSS')->first();
        $flight = DB::table('flights')->first();
        $crew_member_type = DB::table('crew_member_types')->first();

        DB::table('crew_members')->insert([
            'rank' => "Capt",
            'last_name' => "Paetz",
            'first_name' => "Joseph",
            'middle_initial' => "R",
            'call_sign' => "Fox",
            'squadron_id' => $squadron->name,
            'flight_id' => $flight->id,
            'crew_member_type_id' => $crew_member_type->name,
        ]);

        $faker = Faker::create();

        $squadrons = Squadron::all();
        $crew_member_types = CrewMemberType::all();

        // Create random 100 person squadrons.
        foreach($squadrons as $squadron) {
            foreach($crew_member_types as $crew_member_type) {
                foreach(range(1,50) as $index) {
                    DB::table('crew_members')->insert([
                        'last_name'=>$faker->lastName,
                        'squadron_id'=>$squadron->name,
                        'crew_member_type_id'=>$crew_member_type->name,
                    ]);

                }
            }
        }

    }
}
