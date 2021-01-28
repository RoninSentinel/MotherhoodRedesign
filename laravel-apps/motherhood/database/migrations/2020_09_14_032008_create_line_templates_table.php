<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLineTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * ER Diagram/Database attributes: Name, Line Type, Color, Is Active, Order Preference, Call Sign, Is Default, Squadron, AOR
     * 
     * @return void
     */
    public function up()
    {
        Schema::create('line_templates', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('line_type_id')->nullable();
            $table->string('color');
            $table->boolean('is_active')->default(true);
            $table->integer('order_preference')->nullable()->default(0);  // Arbitrarily high number to designate low priority unless set otherwise.
            $table->string('call_sign')->nullable();
            $table->string('squadron_id');
            $table->string('aor_id');
            $table->boolean('is_hidden_in_read_mode')->default(false);
            $table->string('extra_field_name')->nullable()->default("IP/ISO");

            $table->foreign('line_type_id')->references('name')->on('line_types');
            $table->foreign('squadron_id')->references('name')->on('squadrons');
            $table->foreign('aor_id')->references('name')->on('aors');

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
        Schema::dropIfExists('line_templates');
    }
}
