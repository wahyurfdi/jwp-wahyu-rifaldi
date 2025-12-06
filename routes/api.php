<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Todo\TodoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    Route::apiResource('todos', TodoController::class);
    Route::put('todos/{todo}/status', [TodoController::class, 'updateStatus']);
});
