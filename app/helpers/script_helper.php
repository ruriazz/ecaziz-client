<?php

if(!function_exists('Script')) {
    class Script {
        const COMMON_HELPER = array(
            'js/string_helper.js'
        );

        const CONFIG = 'js/app_config.js';

        const CORE_API = 'js/api_client.js';

        const CORE_CRYPTO = 'js/encryption.js';

        const CORE_STORAGE = array(
            self::CORE_CRYPTO,
            'localforage/localforage.js',
            'js/storage.js'
        );

        const CORE_SESSION = array(
            self::CORE_STORAGE,
            'js/app_session.js'
        );

        const CORE_APP = 'js/app.js';

        const CORE_BUNDLE = array(
            self::COMMON_HELPER,
            self::CONFIG,
            self::CORE_SESSION,
            self::CORE_API,
            self::CORE_APP
        );
    }
}