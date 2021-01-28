<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FlightTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $team = DB::table('teams')->first();
        $squadron = DB::table('squadrons')->first();

        DB::table('flights')->insert([
            'name' => "A",
            'team_id' => $team->id,
            'squadron_id' => $squadron->name,
        ]);

        DB::table('flights')->insert([
            'name' => "B",
            'team_id' => $team->id,
            'squadron_id' => $squadron->name,
        ]);
    }
}
