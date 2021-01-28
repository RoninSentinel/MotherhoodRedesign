<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class BlockCategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Refactor to loop through each squadron.
        $squadron = DB::table('squadrons')->where('name', '867ATKS')->first();

        DB::table('block_categories')->insert([
            'name' => "presets",
            'short_name'=> "presets",
            'color' => "#009AFF",  // Light blue-ish.
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        DB::table('block_categories')->insert([
            'name' => "transit",
            'short_name'=> "trnst",
            'color' => "#7FC76D",  // Green-ish.
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        DB::table('block_categories')->insert([
            'name' => "target",
            'short_name'=> "tgt",
            'color' => "#AAAFB8",  // Grey-ish.
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        DB::table('block_categories')->insert([
            'name' => "training",
            'short_name'=> "trng",
            'color' => "#FF4E91",  // Pink-ish.
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        DB::table('block_categories')->insert([
            'name' => "down",
            'short_name'=> "down",
            'color' => "#000000",  // Black.
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);

        DB::table('block_categories')->insert([
            'name' => "maintenance",  // May be malfunction.
            'short_name'=> "mx",
            'color' => "#FF0000",  // Red.
            'is_active' => true,
            'squadron_id' => $squadron->name
        ]);
    }
}
