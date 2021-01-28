<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class SquadronTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('squadrons')->insert([
            'name' => "15ATKS"
        ]);

        DB::table('squadrons')->insert([
            'name' => "17ATKS"
        ]);

        DB::table('squadrons')->insert([
            'name' => "22ATKS"
        ]);

        DB::table('squadrons')->insert([
            'name' => "867ATKS"
        ]);

        DB::table('squadrons')->insert([
            'name' => "732OSS"
        ]);

        DB::table('squadrons')->insert([
            'name' => "Other"
        ]);
    }
}
