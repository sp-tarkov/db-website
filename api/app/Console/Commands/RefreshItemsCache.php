<?php

namespace App\Console\Commands;

use App\Data\ItemsCollection;
use Illuminate\Console\Command;

class RefreshItemsCache extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = "items:refresh";

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Refresh all items cache";


    /**
     * Execute the console command.
     *
     * @param ItemsCollection $itemsCollection
     * @return void
     */
    public function handle(ItemsCollection $itemsCollection): void
    {
        $itemsCollection->refreshAllCache();
    }
}
