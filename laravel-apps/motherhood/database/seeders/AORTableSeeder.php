<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class AORTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('aors')->insert([
            'name' => "AOR1"
        ]);

        DB::table('aors')->insert([
            'name' => "AOR2"
        ]);

        DB::table('aors')->insert([
            'name' => "AOR3"
        ]);

        DB::table('aors')->insert([
            'name' => "AOR4"
        ]);
    }
}
