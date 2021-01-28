<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('access_level');
            $table->string('squadron_id');
            $table->boolean('is_active')->default(true);

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
        Schema::dropIfExists('admin_tokens');
    }
}
