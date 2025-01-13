<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kurs', function (Blueprint $table) {
            $table->string('naziv');
            $table->text('opis')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kurs', function (Blueprint $table) {
            $table->dropColumn(['naziv', 'opis']);
        });
    }
};
