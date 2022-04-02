<?php

if(!function_exists('_load_controllers')) {
    function _load_controllers(String $file_name, String $method = 'index', $data = null) {
        $file = APPPATH . '/controllers/';
        $file .= "$file_name.php";

        if(!file_exists($file)) {
            throw new Exception("File $file is not exists.", 1);
            exit();
        }

        require_once $file;
        $class = ucfirst($file_name);
        try {
            $controller = new $class();
            if($data)
                $controller->$method($data);
            else
                $controller->$method();
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}

if(!function_exists('_load_helper')) {
    function _load_helper(String $file_name) {
        $file = APPPATH . '/helpers/';
        $file .= "$file_name.php";

        if(!file_exists($file)) {
            throw new Exception("File $file is not exists.", 1);
            exit();
        }

        require_once $file;
    }
}

if(!function_exists('_load_view')) {
    function _load_view(String $file_name, Array $data = [], bool $render = true) {
        $file = APPPATH . '/views/';
        $file .= "$file_name.php";

        if(!file_exists($file)) {
            throw new Exception("File $file is not exists.", 1);
            exit();
        }

        $templates = new League\Plates\Engine(APPPATH . '/views/');
        $view = $templates->render("$file_name", $data);
        if($render) {            
            ob_start("sanitize_output");
            echo $view;
            ob_end_flush();
        } else
            return $view;
    }
}