<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQualificationTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Name, Crew Member Type
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('qualification_types', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('crew_member_type_id');
            $table->string('name');

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
        Schema::dropIfExists('qualification_types');
    }
}
