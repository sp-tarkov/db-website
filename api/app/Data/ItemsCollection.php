<?php

namespace App\Data;

use App\Exceptions\ItemNotFoundException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Config\GiteaConfig;
use Illuminate\Support\Facades\Log;

class ItemsCollection
{
    protected Collection $items;
    protected Collection $locales;

    private string $items_cache_key = 'items';
    private string $locales_cache_key = 'locales';

    public function __construct()
    {
        if (!Cache::has($this->items_cache_key)) {
            $this->refreshItemsCache();
        } else {
            $this->items = Cache::get($this->items_cache_key);
        }

        if (!Cache::has($this->locales_cache_key)) {
            $this->refreshLocalesCache();
        } else {
            $this->locales = Cache::get($this->locales_cache_key);
        }
    }

    public function refreshLocalesCache(): void
    {
        $this->locales = collect();
        $rawLocalesGlobalBaseUrl = GiteaConfig::RAW_LOCALES_GLOBAL_BASE_URL;

        // Getting all locales in project/assets/database/locales/global from the Server development branch repository

        $localesList = collect(Http::withOptions(['verify' => false])->get(GiteaConfig::LOCALES_GLOBAL_URL)->json());
        foreach ($localesList as $item) {
            // Extract the json name for the locale
            preg_match('/([a-z]{2}(-[a-z]{2})?).json/', $item['name'], $currentLocaleName, PREG_OFFSET_CAPTURE);

            // If the name is not supported for any reason, dont add it to the locales
            if (empty($currentLocaleName) || !$currentLocaleName[1][0]) continue;

            $trimmedCurrentLocaleName = trim($currentLocaleName[1][0]);
            $currentLocaleJson = Http::withOptions(['verify' => false])
                ->get("${rawLocalesGlobalBaseUrl}/${trimmedCurrentLocaleName}.json")->json();
            $templateLocale = collect($currentLocaleJson['templates']);
            $customizationLocale = collect($currentLocaleJson['customization']);
            $this->locales = $this->locales->merge([$trimmedCurrentLocaleName => $templateLocale->concat($customizationLocale)]);
        }
        Cache::put($this->locales_cache_key, $this->locales);
    }

    /**
     * @return void
     */
    public function refreshItemsCache(): void
    {
        $this->items = collect(Http::withOptions(['verify' => false])->get(GiteaConfig::RAW_ITEMS_URL)->json());
        $this->items = $this->items->merge(collect(Http::withOptions(['verify' => false])
            ->get(GiteaConfig::RAW_CUSTOMIZATION_URL)->json()));
        Cache::put($this->items_cache_key, $this->items);
    }

    /**
     * @return Collection
     */
    public function getLocales(): Collection
    {
        return $this->locales->keys();
    }

    /**
     * @return void
     */
    public function refreshAllCache(): void
    {
        $this->refreshItemsCache();
        $this->refreshLocalesCache();
    }

    /**
     * Checks if the query is in the key
     * @param string $key
     * @param string $query
     * @return bool
     */
    private function contains(string $key, string $query): bool
    {
        $key = Str::lower(trim($key));
        $query = Str::lower(trim($query));

        return Str::contains($key, $query);
    }

    /**
     * @param string $query the content of the query eg. 'AK'
     * @param string $locale the chosen local. Default to 'en'
     * @return Collection
     */
    public function findItem(string $query, string $locale): Collection
    {
        return $this->items->filter(function ($val, $key) use ($query, $locale) {
            return $this->contains($val['_id'], $query)
                || $this->contains($val['_name'], $query)
                || $this->contains($val['_parent'], $query)
                || (($this->locales[$locale][$key] ?? false)
                    && ($this->contains($this->locales[$locale][$key]['Name'], $query) || $this->contains($this->locales[$locale][$key]['ShortName'], $query))
                );
        })->map(function ($item) use ($locale) {
            return [
                'item' => [
                    '_id' => $item['_id'],
                    '_name' => $item['_name'],
                    ],
                'locale' => $this->locales[$locale][$item['_id']] ?? ''
            ];
        })->values();
    }

    /**
     * @param string $id the item ID to look for
     * @param string $locale the chosen local. Default to 'en'
     * @return array
     * @throws ItemNotFoundException
     */
    public function getItemById(string $id, string $locale): array
    {
        $item =  $this->items[$id] ?? throw new ItemNotFoundException('Item not found');
        return [
            'item' => $item,
            'locale' => $this->locales[$locale][$id] ?? ''
        ];
    }

    public function getHierarchy(string $id, string $locale = 'en'): Collection {
        // Return 404 if the item does not exist
        $itemData =  $this->items[$id] ?? throw new ItemNotFoundException('Item not found');

        // Initialize the hierarchy with the current item
        $item = [
            'item'=> [
                '_id' => $itemData['_id'],
                '_name' => $itemData['_name'],
                '_parent' => $itemData['_parent']
            ],
            'locale' => $this->locales[$locale][$id] ?? ''
        ];
        $hierarchy = collect([$id => $item]);

        // Check the whole hierarchy and merge into the return variable
        while (!empty($item['item']['_parent'] ?? '')) {
            $itemtId = $item['item']['_parent'];
            $itemData =  $this->items[$itemtId] ?? null;
            $item = [
                'item'=> [
                    '_id' => $itemData['_id'],
                    '_name' => $itemData['_name'],
                    '_parent' => $itemData['_parent']
                ],
                'locale' => $this->locales[$locale][$itemtId] ?? ''
            ];
            $hierarchy = $hierarchy->merge([$itemtId => $item]);
        }

        return $hierarchy;
    }

    public function getItemLocale(string $locale, string $itemID): array {
        return $this->locales[$locale][$itemID] ?? [];
    }

    /**
     * @param string $locale the chosen local. Default to 'en'
     * @return array
     * @throws ItemNotFoundException
     */
    public function getAllItemsName(string $locale): Collection
    {
        return $this->items->map(function ($item) use ($locale) {
            return [
                'item' => [
                    '_id' => $item['_id'],
                    ],
                'locale' => collect($this->getItemLocale($locale, $item['_id']))->only(['Name', 'ShortName'])
            ];
        })->filter(function ($item) {
            return json_encode($item['locale']) != '[]';
        })->values();
    }

    /**
     * @param string $id the item ID to look for
     * @param string $locale the chosen local. Default to 'en'
     * @return array
     * @throws ItemNotFoundException
     */
    public function getItemNameById(string $id, string $locale): array
    {
        $itemLocale = $this->locales[$locale][$id] ?? '';

        if ($itemLocale == '') {
            return $itemLocale;
        }

        return [
            'locale' => collect($itemLocale)->only(['Name', 'ShortName'])
        ];
    }
}