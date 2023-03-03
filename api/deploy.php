<?php
namespace Deployer;

require 'recipe/laravel.php';

// Project name
set('application', 'SPT-Items-API');

// Project repository
set('repository', 'https://dev.sp-tarkov.com/Rev/spt-items-api.git');

set('shared_dirs', [
    'storage/app',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
]);

// Writable dirs by web server
add('writable_dirs', []);
set('writable_use_sudo', false);

// Hosts
host('spt-server')
    ->multiplexing(false)
    ->become('apache')
    ->set('deploy_path', '/var/www/html');

task('artisan:cache:clear', function () {
    run('{{bin/php}} {{release_path}}/artisan cache:clear');
})->desc('Execute artisan cache:clear');

task('deploy:vendors', function () {
   run('cd {{release_path}} && /usr/local/bin/composer install --verbose --prefer-dist --no-progress --no-interaction --optimize-autoloader --no-suggest');
})->desc('installing composer packages');


task('artisan:config:cache', function() {})->setPrivate();
task('artisan:down', function() {})->setPrivate();
task('artisan:event:cache', function() {})->setPrivate();
task('artisan:event:clear', function() {})->setPrivate();
task('artisan:horizon:terminate', function() {})->setPrivate();
task('artisan:optimize', function() {})->setPrivate();
task('artisan:optimize:clear', function() {})->setPrivate();
task('artisan:route:cache', function() {})->setPrivate();
task('artisan:storage:link', function() {})->setPrivate();
task('artisan:up', function() {})->setPrivate();
task('artisan:view:cache', function() {})->setPrivate();
task('artisan:view:clear', function() {})->setPrivate();

// custom task
task('items:refresh', function () {
    run('cd {{release_path}} && php artisan items:refresh');
});

// Tasks
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:vendors',
    'deploy:writable',
    'artisan:cache:clear',
    'items:refresh',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
]);

// [Optional] If deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');
