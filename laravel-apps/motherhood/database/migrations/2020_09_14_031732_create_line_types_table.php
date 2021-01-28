<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLineTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Name
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('line_types', function (Blueprint $table) {
            $table->string('name');

            $table->timestamp('creation_date')->useCurrent();
            $table->timestamp('last_update')->useCurrent();

            $table->primary('name');

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
        Schema::dropIfExists('line_types');
    }
}