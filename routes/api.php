<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('kursevi', [KursController::class, 'index'])->name('kursevi.index');
    Route::get('kursevi/{id}', [KursController::class, 'show'])->name('kursevi.show');
    Route::post('kursevi', [KursController::class, 'store'])->name('kursevi.store');
    Route::put('kursevi/{id}', [KursController::class, 'update'])->name('kursevi.update');
    Route::delete('kursevi/{id}', [KursController::class, 'destroy'])->name('kursevi.destroy');
});
