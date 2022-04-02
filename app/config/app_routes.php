<?php

$router->set404(function() {
    header('HTTP/1.1 404 Not Found');
    _load_view('errors/404');
});

$router->setBasePath('/');

$router->get('/', function() {
    _load_controllers('home', 'index');
});