<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrewMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Rank, Last Name, First Name, Middle Initial, Call Sign, Squadron
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('crew_members', function (Blueprint $table) {
            $table->id();
            $table->string('rank')->nullable();
            $table->string('last_name');
            $table->string('first_name')->nullable();
            $table->string('middle_initial')->nullable();
            $table->string('call_sign')->nullable();
            $table->string('squadron_id');
            $table->unsignedBigInteger('flight_id')->nullable();
            $table->string('crew_member_type_id');

            $table->foreign('squadron_id')->references('name')->on('squadrons');
            $table->foreign('flight_id')->references('id')->on('flights');
            $table->foreign('crew_member_type_id')->references('name')->on('crew_member_types');

            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('last_update')->useCurrent();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('crew_members');
    }
}
