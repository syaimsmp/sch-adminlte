<?php

namespace Syaim\DynamicMenu\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class InstallCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'install:sch-adminlte {--f|migrate-fresh : run artisan migrate fresh} {--m|migrate : run artisan migrate} {--s|seed : seed Permission and Menu table} {--p|publish : publish adminlte asset} {--a|all : Run all related asset}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install adminlte env!';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $shouldMigrateFresh = $this->option('migrate-fresh');
        $shouldMigrate = $this->option('migrate');
        $shouldSeed = $this->option('seed');
        $shouldPublish = $this->option('publish');
        $runAll = $this->option('all');

        if($shouldMigrateFresh){
            Artisan::call('migrate:fresh');
            $this->info('Artisan migrate:fresh run!');
        }
        if( ($shouldMigrate && !$shouldMigrateFresh) || $runAll){
            Artisan::call('migrate');
            $this->info('Artisan migrate run!');

        }
        if($shouldSeed || $runAll){
            Artisan::call('db:seed', [
                '--class' => 'Syaim\\DynamicMenu\\seeds\\PermissionRoleUserSeeder',
            ]);
            Artisan::call('db:seed', [
                '--class' => 'Syaim\\DynamicMenu\\seeds\\MenuSeeder',
            ]);
            $this->info('Database Seeded!');

        }
        if($shouldPublish || $runAll){
            Artisan::call('vendor:publish', [
                '--tag' => 'sch-adminlte_asset',
                '--force' => true
            ]);
            $this->info('File Published!');

        }

        return;
    }
}
