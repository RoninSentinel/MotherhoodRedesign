<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class LineTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('line_types')->insert([
            'name' => "MQ-9"
        ]);

        DB::table('line_types')->insert([
            'name' => "MQ-9X"
        ]);

    }
}
