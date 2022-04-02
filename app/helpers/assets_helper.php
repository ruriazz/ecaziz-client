<?php

define('ASSETS', PUBLICDIR . DIRECTORY_SEPARATOR . 'assets');
define('ASSETS_CORE', ASSETS . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR);
define('ASSETS_DIST', BASEPATH . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR);

use MatthiasMullie\Minify;

class Assets
{

    public static function init() {
        if (!file_exists(ASSETS_CORE)) {
            mkdir(ASSETS_CORE, 0777);
            if(!file_exists(ASSETS_CORE . 'index.html')) {
                $index = file_get_contents(APPPATH . '/views/errors/404.html');
                file_put_contents(ASSETS_CORE . 'index.html', $index);
            }
        }
    }

    public static function core(String $path = "") {
        self::init();

        return ASSETS_CORE . DIRECTORY_SEPARATOR . $path;
    }

    public static function dist(String $path = "") {
        return ASSETS_DIST . $path;
    }


    public static function create(Array $assets, String $type)
    {
        $css = array();
        $js = array();

        $callback = function ($value, $key) use (&$css, &$js) {
            $type = pathinfo($value, PATHINFO_EXTENSION);
            if (is_bool(strpos($value, self::dist())))
                $value = self::dist("$value");

            if (!file_exists($value))
                throw new Exception("No file found $value");

            if ($type !== 'css' && $type !== 'js')
                throw new Exception("the create assets() function only accepts css and js files, not including .$type files");

            array_push($$type, $value);
            $$type = array_unique($$type);
        };
        array_walk_recursive($assets, $callback);

        if($type == 'css') {
            $miniCSS = "";
            foreach ($css as $mainCSS) {
                try {
                    $file = file_get_contents($mainCSS);
                    $miniCSS .= $file;
                } catch (\Throwable $th) {
                    throw $th;
                    
                }
            }

            $cssFileName = md5($miniCSS) . ".min.css";
            $cssFile = self::core($cssFileName);
            if (!file_exists($cssFile)) {
                $miniCSS = "";
                foreach ($css as $mainCSS) {
                    $file = file_get_contents($mainCSS);
                    $file = (new Minify\CSS($file))->minify();
                    $miniCSS .= $file;
                }
        
                $miniCSS = trim($miniCSS);
                if (strlen($miniCSS) > 0) {
                    $cssFileName = md5($miniCSS) . ".min.css";
                    $cssFile = self::core($cssFileName);
                    if (!file_exists($cssFile))
                        file_put_contents($cssFile, $miniCSS);
                }
            }

        } else if($type = 'js') {
            $miniJS = "";
            foreach ($js as $mainJS) {
                try {
                    $file = file_get_contents($mainJS);
                    $miniJS .= $file;
                    $rearJs = substr($miniJS, -1);
                    if ($rearJs !== ';')
                        $miniJS .= ';';
                } catch (\Throwable $th) {
                    throw $th;
                }
            }

            $jsFileName = md5($miniJS) . ".min.js";
            $jsFile = self::core($jsFileName);
            if (!file_exists($jsFile)) {
                $miniJS = "";
                foreach ($js as $mainJS) {
                    $file = file_get_contents($mainJS);
                    $file = (new Minify\JS($file))->minify();
                    $miniJS .= $file;
                    $rearJs = substr($miniJS, -1);
                    if ($rearJs !== ';')
                        $miniJS .= ';';
                }
        
                $miniJS = trim($miniJS);
                if (strlen($miniJS) > 0) {
                    $jsFileName = md5($miniJS) . ".min.js";
                    $jsFile = self::core($jsFileName);
                    if (!file_exists($jsFile))
                        file_put_contents($jsFile, $miniJS);
                }
            }
        }


        return (object) [
            'css' => isset($cssFileName) ? base_url("assets/core/$cssFileName") : null,
            'js' => isset($jsFileName) ? base_url("assets/core/$jsFileName") : null
        ];
    }
}
