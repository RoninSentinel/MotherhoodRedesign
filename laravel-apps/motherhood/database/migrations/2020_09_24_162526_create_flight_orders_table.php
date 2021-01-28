<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlightOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('flight_orders', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('crew_member_id');
            $table->date('date');
            $table->unsignedBigInteger('shift_template_instance_id');
            $table->decimal('total_hours_scheduled', 3, 1)->default(0);

            $table->foreign('crew_member_id')->references('id')->on('crew_members');
            $table->foreign('shift_template_instance_id')->references('id')->on('shift_template_instances');

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
        Schema::dropIfExists('flight_orders');
    }
}
