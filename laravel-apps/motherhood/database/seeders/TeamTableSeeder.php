<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $squadron = DB::table('squadrons')->first();
        
        DB::table('teams')->insert([
            'name' => "Red",
            'squadron_id' => $squadron->name,
        ]);

        DB::table('teams')->insert([
            'name' => "White",
            'squadron_id' => $squadron->name,
        ]);

        DB::table('teams')->insert([
            'name' => "Blue",
            'squadron_id' => $squadron->name,
        ]);
    }
}
