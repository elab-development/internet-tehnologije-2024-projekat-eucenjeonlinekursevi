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
        Schema::table('komentars', function (Blueprint $table) {
            $table->foreign('korisnik_id')->references('id')->on('korisniks')->onDelete('cascade');
            $table->foreign('kurs_id')->references('id')->on('kurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('komentars', function (Blueprint $table) {
            //
        });
    }
};
