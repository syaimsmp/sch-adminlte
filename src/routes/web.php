<?php

Route::namespace('Syaim\DynamicMenu\Http\Controllers')->middleware(['web'])->group(function (){

    Route::resource('menus', MenuController::class);

});
