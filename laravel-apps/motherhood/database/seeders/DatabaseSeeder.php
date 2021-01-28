<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([

            AORTableSeeder::class,
            LineTypeTableSeeder::class,
            CrewMemberTypeTableSeeder::class,
            SquadronTableSeeder::class,
            BlockCategoryTableSeeder::class,
            TeamTableSeeder::class, 

            // Dependents.
            ShiftTemplateTableSeeder::class,  // Must run after squadrons.
            QualificationTypeTableSeeder::class,  // Must run after crew member types.
            //ShiftTemplateInstanceTableSeeder::class,  // Must run after shift templates.
            LineTemplateTableSeeder::class, // Must run after line types AND squadrons AND aors.
            //LineInstanceTableSeeder::class,  // Must run after shift template instances AND line templates.
            //ShiftLineTimeBlockTableSeeder::class,  // Must run after line instances AND block categories.
            FlightTableSeeder::class,  // Must run after squadrons AND teams.
            CrewMemberTableSeeder::class, // Must run after squadrons AND flights AND crew member types.
            QualificationsTableSeeder::class,  // Must run after qualification types AND crew members.
            //FlightOrdersTableSeeder::class,  // Must run after crew members AND shift template instances.
            //CrewMemberShiftLineTimeBlocksTableSeeder::class,  // Must run after crew members AND shift line time blocks.

        ]);
    }
}
