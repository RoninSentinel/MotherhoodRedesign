<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrewMemberShiftLineTimeBlocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Crew Member, Shift Line Time Block, Position
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('crew_member_shift_line_time_blocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crew_member_id')->nullable();
            $table->unsignedBigInteger('shift_line_time_block_id');
            $table->integer('position');

            $table->foreign('crew_member_id')->references('id')->on('crew_members');
            // "sltb" to prevent error related to too long of a name.
            $table->foreign('shift_line_time_block_id', 'sltb_id_foreign')->references('id')->on('shift_line_time_blocks'); 

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
        Schema::dropIfExists('crew_member_shift_line_time_blocks');
    }
}
