<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function ()  {
    return redirect('/search');
});

$router->get('/search[/{id}]', function ()  {
    return view('app');
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->get('locales', 'ItemController@getLocales');
    $router->get('refresh', 'ItemController@refreshAllCache');
    $router->post('search', 'ItemController@search');
    $router->get('item/hierarchy', 'ItemController@getHierarchy');
    $router->get('item/names', 'ItemController@getAllItemsName');
    $router->get('item/nameByID', 'ItemController@getItemNameByID');
    $router->get('item', 'ItemController@getItem');
});

