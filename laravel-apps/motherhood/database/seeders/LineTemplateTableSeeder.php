<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Str;

class LineTemplateTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $squadron = DB::table('squadrons')->where('name', '867ATKS')->first();
        $line_type = DB::table('line_types')->where('name', 'MQ-9')->first();
        $aor = DB::table('aors')->where('name', 'AOR3')->first();

        DB::table('line_templates')->insert([
            'name' => "GCS1",
            'line_type_id' => $line_type->name,
            'color' => "#FF0000",  // Red.
            'is_active' => true,
            'order_preference' => 1,
            'call_sign' => 'CN1',
            'squadron_id' => $squadron->name,
            'aor_id' => $aor->name,
            'is_hidden_in_read_mode' => false,
            'extra_field_name' => "IP/ISO",
        ]);

        DB::table('line_templates')->insert([
            'name' => "GCS2",
            'line_type_id' => $line_type->name,
            'color' => "#C1CBC4",  // Gray-ish.
            'is_active' => true,
            'order_preference' => 2,
            'call_sign' => 'CN2',
            'squadron_id' => $squadron->name,
            'aor_id' => $aor->name,
            'is_hidden_in_read_mode' => false,
            'extra_field_name' => "IP/ISO",
        ]);

        DB::table('line_templates')->insert([
            'name' => "GCS3",
            'line_type_id' => $line_type->name,
            'color' => "#0000FF",  // Blue-ish.
            'is_active' => true,
            'order_preference' => 3,
            'call_sign' => 'CN3',
            'squadron_id' => $squadron->name,
            'aor_id' => $aor->name,
            'is_hidden_in_read_mode' => false,
            'extra_field_name' => "IP/ISO",
        ]);

        DB::table('line_templates')->insert([
            'name' => "GCS4",
            'line_type_id' => $line_type->name,
            'color' => "#000000",  // Black.
            'is_active' => true,
            'order_preference' => 4,
            'call_sign' => 'CN4',
            'squadron_id' => $squadron->name,
            'aor_id' => $aor->name,
            'is_hidden_in_read_mode' => false,
            'extra_field_name' => "IP/ISO",
        ]);

        DB::table('line_templates')->insert([
            'name' => "GCS5",
            'line_type_id' => $line_type->name,
            'color' => "#FFF600",  // Yellow-ish.
            'is_active' => true,
            'order_preference' => 5,
            'call_sign' => 'CN5',
            'squadron_id' => $squadron->name,
            'aor_id' => $aor->name,
            'is_hidden_in_read_mode' => false,
            'extra_field_name' => "IP/ISO",
        ]);

        DB::table('line_templates')->insert([
            'name' => "GCS6",
            'line_type_id' => $line_type->name,
            'color' => "#FF984E",  // Orange-ish.
            'is_active' => true,
            'order_preference' => 6,
            'call_sign' => 'CN6',
            'squadron_id' => $squadron->name,
            'aor_id' => $aor->name,
            'is_hidden_in_read_mode' => false,
            'extra_field_name' => "IP/ISO",
        ]);

        DB::table('line_templates')->insert([
            'name' => "MCCs",
            'color' => "#000000",  // Black.
            'is_active' => true,
            'squadron_id' => $squadron->name,
            'aor_id' => $aor->name,
            'is_hidden_in_read_mode' => true,

        ]);
    }
}
