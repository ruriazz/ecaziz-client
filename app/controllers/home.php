<?php defined('BASEPATH') or exit('No direct script access allowed');

class Home {
    public function __construct() {
        
    }

    public function index() {
        $view = new ViewData();
        $view->create_script([Script::CORE_BUNDLE, 'js/pages/home.js']);
        $view->add_body('pages/home_index');

        $view->render();
    }
}