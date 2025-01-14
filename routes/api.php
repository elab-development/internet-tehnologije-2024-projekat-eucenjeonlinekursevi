<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KursController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SearchController;

Route::get('/korisnik', function (Request $request) {
    return response()->json($request->user());
})->middleware('auth:sanctum');
Route::get('kursevi/{id}', [KursController::class, 'show'])->name('kursevi.show');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('kursevi', [KursController::class, 'index'])->name('kursevi.index');
    //Route::get('kursevi/{id}', [KursController::class, 'show'])->name('kursevi.show');
    Route::post('kursevi', [KursController::class, 'store'])->name('kursevi.store');
    Route::put('kursevi/{id}', [KursController::class, 'update'])->name('kursevi.update');
    Route::delete('kursevi/{id}', [KursController::class, 'destroy'])->name('kursevi.destroy');
});

Route::post('register/korisnik', [AuthController::class, 'registerKorisnik']);
Route::post('login/korisnik', [AuthController::class, 'loginKorisnik']);

Route::post('register/profesor', [AuthController::class, 'registerProfesor']);
Route::post('login/profesor', [AuthController::class, 'loginProfesor']);

Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);


Route::post('/password/reset', [App\Http\Controllers\PasswordResetController::class, 'reset']);
Route::get('/search', [SearchController::class, 'search']);

Route::fallback(function () {
    return response()->json([
        'error' => 'Not Found'
    ], 404);
});