<?php

define('ENVIRONMENT', isset($_SERVER['APP_ENV']) ? $_SERVER['APP_ENV'] : 'development');

switch (ENVIRONMENT) {
    case 'development':
        error_reporting(-1);
        ini_set('display_errors', 1);

        if (is_dir(__DIR__ . '/assets/core')) {
            if ($handle = opendir(__DIR__ . '/assets/core')) {
                $i = 0;
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        $i++;
                    }
                }
                closedir($handle);
    
                if ($i > 10) {
                    if ($handle = opendir(__DIR__ . '/assets/core')) {
                        while (false !== ($entry = readdir($handle))) {
                            if ($entry != "." && $entry != ".." && $entry != 'index.html' && $entry !== 'index.php') {
                                unlink(__DIR__ . "/assets/core/$entry");
                            }
                        }
                        closedir($handle);
                    }
                }
            }
        }
        break;

    case 'testing':
    case 'production':
        ini_set('display_errors', 0);
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_USER_NOTICE & ~E_USER_DEPRECATED);
        break;

    default:
        header('HTTP/1.1 503 Service Unavailable.', TRUE, 503);
        echo 'The application environment is not set correctly.';
        exit(1);
}

define('BASEPATH', dirname(__DIR__, 1));
define('APPPATH', BASEPATH . DIRECTORY_SEPARATOR . 'app');
define('SYSPATH', BASEPATH . DIRECTORY_SEPARATOR . 'src');
define('PUBLICDIR', __DIR__);

require_once SYSPATH . '/core/application.php';