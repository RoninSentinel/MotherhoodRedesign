<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLineInstancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Line Template, Shift Template Instance, Color
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('line_instances', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('line_template_id');
            $table->unsignedBigInteger('shift_template_instance_id');

            $table->foreign('line_template_id')->references('id')->on('line_templates');
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
        Schema::dropIfExists('line_instances');
    }
}
