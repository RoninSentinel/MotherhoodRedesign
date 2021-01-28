<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
*/

Route::post('line-instances/batch-create', [LineInstanceController::class, 'batch_create']);
Route::post('line-instances/batch-update', [LineInstanceController::class, 'batch_update']);
Route::delete('line-instances/batch-delete', [LineInstanceController::class, 'batch_delete']);

Route::post('shift-line-time-blocks/batch-update', [ShiftLineTimeBlockController::class, 'batch_update']);
Route::delete('shift-line-time-blocks/batch-delete', [ShiftLineTimeBlockController::class, 'batch_delete']);

Route::post('crew-shift-line-time-blocks/batch-update', [CrewMemberShiftLineTimeBlocksController::class, 'batch_update']);
Route::delete('crew-shift-line-time-blocks/batch-delete', [CrewMemberShiftLineTimeBlocksController::class, 'batch_delete']);

Route::post('flight-orders/batch-update', [FlightOrdersController::class, 'batch_update']);
Route::delete('flight-orders/batch-delete', [FlightOrdersController::class, 'batch_delete']);

Route::apiResources([
    'aors' => AORController::class,
    'block-categories' => BlockCategoryController::class,
    'crew-members' => CrewMemberController::class,
    'crew-member-types' => CrewMemberTypeController::class,
    'line-instances' => LineInstanceController::class,
    'line-templates' => LineTemplateController::class,
    'line-types' => LineTypeController::class,
    'qualifications' => QualificationsController::class,
    'qualification-types' => QualificationTypeController::class,
    'shift-line-time-blocks' => ShiftLineTimeBlockController::class,
    'shift-templates' => ShiftTemplateController::class,
    'shift-template-instances' => ShiftTemplateInstanceController::class,
    'squadrons' => SquadronController::class,
    'flight-orders' => FlightOrdersController::class,
    //'crew-member-shift-line-time-blocks' => CrewMemberShiftLineTimeBlocksController::class,  // Bug: Limited to 32 characters for POST.
    'crew-shift-line-time-blocks' => CrewMemberShiftLineTimeBlocksController::class,
    'flights' => FlightController::class,
    'teams' => TeamController::class,
    'admin-tokens' => AdminTokenController::class,
    
]);

