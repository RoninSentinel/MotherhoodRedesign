<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('team_id')->nullable();
            $table->string('squadron_id');

            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('last_update')->useCurrent();
            
            $table->foreign('team_id')->references('name')->on('teams');
            $table->foreign('squadron_id')->references('name')->on('squadrons');

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
        Schema::dropIfExists('flights');
    }
}
