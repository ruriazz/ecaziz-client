<?php

require_once SYSPATH . '/vendor/autoload.php';
require_once SYSPATH . '/core/helpers.php';
require_once SYSPATH . '/core/loaders.php';

foreach (app_config('autoload')['helpers'] as $value) {
    _load_helper($value);
}

$router = new \Bramus\Router\Router();
require_once APPPATH . '/config/app_routes.php';
$router->run();