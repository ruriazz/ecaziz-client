<?php defined('BASEPATH') or exit('No direct script access allowed');

class Home {
    public function __construct() {
        
    }

    public function index() {
        $view = new ViewData();
        $view->create_script([Script::CORE_BUNDLE, 'js/pages/home.js', 'splide/js/splide.min.js']);
        $view->create_style(['splide/css/splide.min.css', 'splide/css/themes/splide-skyblue.min.css', 'css/pages/home.css']);
        $view->add_body('pages/home_index');

        $view->render();
    }
}