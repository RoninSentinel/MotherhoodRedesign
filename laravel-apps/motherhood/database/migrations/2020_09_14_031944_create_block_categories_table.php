<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlockCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Name, Short Name, Color, Is Active, Squadron
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('block_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_name');
            $table->string('color');
            $table->boolean('is_active')->default(true);
            //$table->foreignId('squadron_id');
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
        Schema::dropIfExists('block_categories');
    }
}
