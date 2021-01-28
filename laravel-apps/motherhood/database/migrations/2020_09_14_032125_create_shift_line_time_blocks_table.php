<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShiftLineTimeBlocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Line Instance, Start Time, End Time, Notes, Position, Mission Number, Block Category
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('shift_line_time_blocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('line_instance_id');
            $table->unsignedBigInteger('block_category_id')->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('notes')->nullable();
            $table->integer('position');
            $table->integer('mission_number')->nullable();

            $table->foreign('line_instance_id')->references('id')->on('line_instances');
            $table->foreign('block_category_id')->references('id')->on('block_categories');

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
        Schema::dropIfExists('shift_line_time_blocks');
    }
}
