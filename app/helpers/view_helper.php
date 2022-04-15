<?php

if (!class_exists('ViewData')) {
    class ViewData
    {
        public array $html_meta = [];
        public array $html_body = [];
        public array $link_style = [];
        public array $script_src = [];
        public array $data = [];
        public String $page_title = 'Elsya &#038; Aziz';

        public function __construct()
        {
            $init_meta = array(
                ["name" => "author", "content" => "ruriazz"],
                ["name" => "robots", "content" => "noindex, nofollow"],
                ["name" => "description", "content" => "Sunday, May 22nd, 2022 - Jakarta"],
                ["property" => "og:type", "content" => "website"],
                ["property" => "og:site_name", "content" => "ruriazz Wedding Invitation"],
                ["property" => "og:url", "content" => base_url()],
                ["property" => "twitter:url", "content" => base_url()],
                ["property" => "og:image", "content" => base_url('assets/images/banner/banner_1200x630.jpg')],
                ["property" => "twitter:image", "content" => base_url('assets/images/banner/banner_1200x630.jpg')],
                ["property" => "twitter:card", "content" => "summary_large_image"],
                ["property" => "twitter:creator", "content" => "@ruriazz"],
                ["property" => "og:locale", "content" => "en_US"],
                ["property" => "og:title", "content" => "Wedding of Elsya &#038; Aziz"],
                ["property" => "og:description", "content" => "Sunday, May 22nd, 2022 - Jakarta"],
                ["property" => "og:updated_time", "content" => (new DateTime())->format(DateTime::ATOM)],
                ["property" => "article:published_time", "content" => (new DateTime('2022-03-31 23:59:59'))->format(DateTime::ATOM)],
                ["property" => "article:modified_time", "content" => (new DateTime())->format(DateTime::ATOM)],
                // ["property" => "", "content" => ""],
                // ["name" => "", "content" => ""],
            );

            $this->create_meta($init_meta);
            $this->create_script([
                base_url('assets/bower_components/axios/dist/axios.min.js'),
                base_url('assets/bower_components/crypto-js/crypto-js.js')
            ], 'text/javascript');

            $this->create_style([
                'css/animate.css',
                'css/themify-icons.css',
                'css/bootstrap.css',
                'css/magnific-popup.css',
                'css/owl.carousel.min.css',
                'css/owl.theme.default.min.css',
                'css/vegas.slider.min.css',
                'css/style.css'
            ]);
        }

        public function create_meta(array $data)
        {
            $meta = '<meta PROP_NAME="PROP_VALUE" content="CONTENT">';

            $meta_created = array();
            foreach ($data as $value) {
                $key = 'property';
                if (array_key_exists('name', $value)) {
                    $key = 'name';
                }

                $key_value = $value[$key];
                $content = $value['content'];
                $new_meta = str_replace('PROP_NAME', $key, $meta);
                $new_meta = str_replace('PROP_VALUE', $key_value, $new_meta);
                $new_meta = str_replace('CONTENT', $content, $new_meta);
                array_push($meta_created, $new_meta);
            }

            if (count($meta_created) > 0) {
                $new_meta = array_merge($this->html_meta, $meta_created);
                $this->html_meta = array_unique($new_meta);

            }
        }

        public function add_body($view)
        {
            if (is_string($view)) {
                array_push($this->html_body, _load_view($view, [], false));
            } else if (is_array($view)) {
                foreach ($view as $v) {
                    array_push($this->html_body, _load_view($v, [], false));
                }
            }

            $this->html_body = array_unique($this->html_body);
        }

        public function create_style($dist, String $rel = "stylesheet")
        {
            $style = '<link href="HREF" rel="REL">';

            if (is_string($dist)) {
                return $this->create_style([$dist], $rel);
            } else if (is_array($dist)) {
                foreach ($dist as $path) {
                    if (filter_var($path, FILTER_VALIDATE_URL)) {
                        $new_style = str_replace('HREF', $cdn, $style);
                        $new_style = str_replace('REL', $rel, $new_style);
                        array_push($this->link_style, $new_style);
                    } else {
                        $assets = Assets::create($dist, 'css');
                        if ($assets->css) {
                            $new_style = str_replace('HREF', $assets->css, $style);
                            $new_style = str_replace('REL', $rel, $new_style);

                            array_push($this->link_style, $new_style);
                            break;
                        }
                    }
                }
            }

            $this->link_style = array_unique($this->link_style);
        }

        public function create_script($dist = null, String $type = "module")
        {
            $script = '<script src="SRC" type="TYPE"></script>';

            if (is_string($dist)) {
                return $this->create_script([$dist], $type);
            } else if (is_array($dist)) {
                foreach ($dist as $path) {
                    if (filter_var($path, FILTER_VALIDATE_URL)) {
                        $new_script = str_replace('SRC', $path, $script);
                        $new_script = str_replace('TYPE', $type, $new_script);
                        array_push($this->script_src, $new_script);
                    } else {
                        $assets = Assets::create($dist, 'js');
                        if ($assets->js) {
                            $new_script = str_replace('SRC', $assets->js, $script);
                            $new_script = str_replace('TYPE', $type, $new_script);
                        }

                        array_push($this->script_src, $new_script);
                        break;
                    }
                }
            }

            $this->script_src = array_unique($this->script_src);
        }

        public function render(bool $is_auth = true)
        {
            if (!$is_auth) {
                return _load_view('pages/auth_index', ['view_data' => $this]);
            }

            return _load_view('template/main_view', ['view_data' => $this]);
        }
    }
}
