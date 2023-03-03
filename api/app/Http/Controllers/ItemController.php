<?php

namespace App\Http\Controllers;

use App\Data\ItemsCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Throwable;

class ItemController extends Controller
{
    /**
     * @var ItemsCollection
     */
    private ItemsCollection $itemsCollection;

    public function __construct(ItemsCollection $itemsCollection)
    {
        $this->itemsCollection = $itemsCollection;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $status = Response::HTTP_NO_CONTENT;
        $result = $this->itemsCollection->findItem($request->input('query'), $request->input('locale') ?? 'en');
        $response = [];
        if ($result->isNotEmpty()) {
            $status = Response::HTTP_OK;
            $response = [
                'items' => $result->toArray(),
            ];
        }
        return response()->json($response, $status);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function getItem(Request $request): JsonResponse
    {
        try {
            return response()->json(
                $this->itemsCollection->getItemById(
                    $request->query('id', ''), $request->query('locale', 'en')
                )
            );
        } catch (Throwable $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
            return response()->json([
                'error' => 'Item not found.',
            ], Response::HTTP_NOT_FOUND);
        }
    }


    // $router->get('item/list', 'ItemController@getAllItems');
    // $router->get('item/nameByID', 'ItemController@getItemNameByID');

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllItemsName(Request $request): JsonResponse
    {
        try {
            return response()->json(
                $this->itemsCollection->getAllItemsName($request->query('locale', 'en'))
            );
        } catch (Throwable $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
            return response()->json([
                'error' => 'Error during items collection.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function getItemNameByID(Request $request): JsonResponse
    {
        try {
            return response()->json(
                $this->itemsCollection->getItemNameById(
                    $request->query('id', ''), $request->query('locale', 'en')
                )
            );
        } catch (Throwable $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
            return response()->json([
                'error' => 'Item not found.',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * @param Request $request The request
     * @return JsonResponse Either {"error":"item not found"} or an object containing
     *                      for each id, an object looking like
     *                      {"item":{"_id":"id","_name":"name","_parent":"parent"}, "locale": {"Description":"description", "Name":"name", "ShortName":"shortName"}}
     */
    public function getHierarchy(Request $request): JsonResponse
    {
        try {
            return response()->json(
                $this->itemsCollection->getHierarchy(
                    $request->query('id'), $request->query('locale', 'en')
                )
            );
        } catch (Throwable $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
            return response()->json([
                'error' => 'Item not found.',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * @return JsonResponse
     */
    public function getLocales(): JsonResponse
    {
        try {
            return response()->json($this->itemsCollection->getLocales());
        } catch (Throwable $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
            return response()->json([
                'error' => 'No locale found.',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * @return JsonResponse
     */
    public function refreshAllCache(): JsonResponse
    {
        try {
            $this->itemsCollection->refreshAllCache();
            return response()->json([], Response::HTTP_NO_CONTENT);
        } catch (Throwable $exception) {
            Log::error($exception->getMessage());
            Log::error($exception->getTraceAsString());
            return response()->json([
                'error' => 'Internal error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}