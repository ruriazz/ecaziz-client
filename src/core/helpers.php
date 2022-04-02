<?php

if(!function_exists('app_config')) {
    function app_config(String $key) {
        if(!isset($config))
            require APPPATH . '/config/app_config.php';

        if(isset($config)) {
            if(!array_key_exists($key, $config))
                throw new Exception("config[$key] is not exists.", 1);

            return $config["$key"];
        }

        return null;
    }
}

if(!function_exists('base_url')) {
    function base_url(String $path = "") {
        $base_url = app_config('base_url');

        while(substr($base_url, -1) == '/') {
            $i = strlen($base_url) - 1;
            $base_url = substr_replace($base_url, '', $i, 1);
        }

        while(substr($path, -1) == '/') {
            $i = strlen($path) - 1;
            $path = substr_replace($path, '', $i, 1);
        }

        return "$base_url/$path";
    }
}

if(!function_exists('sanitize_output')) {
    function sanitize_output($buffer) {
        $search = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s', '/<!--(.|\s)*?-->/');
        $replace = array('>', '<', '\\1', '');
        $buffer = preg_replace($search, $replace, $buffer);
    
        return $buffer;
    }
}