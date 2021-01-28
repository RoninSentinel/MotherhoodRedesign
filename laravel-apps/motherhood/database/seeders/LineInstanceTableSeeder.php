<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class LineInstanceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $line_templates = DB::table('line_templates')->where('is_active', true)->get();
        $shift_template_instance = DB::table('shift_template_instances')->get()->first();

        foreach($line_templates as $line_template)  {
            DB::table('line_instances')->insert([
                'line_template_id' => $line_template->id,
                'shift_template_instance_id' => $shift_template_instance->id,
            ]);
        }
    }
}
