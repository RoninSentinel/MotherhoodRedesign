<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShiftTemplateInstancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Shift Template, Date
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('shift_template_instances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shift_template_id');
            $table->date('date');

            $table->foreign('shift_template_id')->references('id')->on('shift_templates');

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
        Schema::dropIfExists('shift_template_instances');
    }
}
