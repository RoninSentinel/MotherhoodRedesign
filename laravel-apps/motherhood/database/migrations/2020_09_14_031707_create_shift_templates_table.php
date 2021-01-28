<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShiftTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     * 
     * ER Diagram/Database attributes: Name, Start Time, End Time, Total Hours, Is Active, Squadron
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shift_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->decimal('total_hours')->default(0.0);
            $table->boolean('is_active')->default(true);
            $table->string('squadron_id');

            $table->foreign('squadron_id')->references('name')->on('squadrons');

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
        Schema::dropIfExists('shift_templates');
    }
}
