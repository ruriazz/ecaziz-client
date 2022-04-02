<!DOCTYPE HTML>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php
    if (isset($view_data->html_meta)) {
        foreach ($view_data->html_meta as $meta) {
            echo $meta;
        }
    }
    ?>

    <link rel="icon" type="image/png" href="<?php echo base_url('assets/images/favicon.png'); ?>" />
    <title><?php if (isset($view_data->page_title)) echo $view_data->page_title; ?></title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&amp;family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&amp;family=Nunito+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&amp;display=swap" />

    <?php
    if (isset($view_data->link_style)) {
        foreach ($view_data->link_style as $style) {
            echo $style;
        }
    }
    ?>
    <!-- FOR IE9 below -->
    <!--[if lt IE 9]>
<script src="assets/js/respond.min.js"></script>
<![endif]-->
</head>

<body>
    <!-- Preloader -->
    <div class="preloader">
        <div class="lds-heart">
            <div></div>
        </div>
    </div>
    <!-- Main -->
    <div id="oliven-page">
        <!-- Sidebar Section -->
        <?php _load_view('template/menu'); ?>
        <!-- Content Section -->
        <div id="oliven-main">
            <!-- Header & Slider -->
            <?php
            if (isset($view_data->html_body)) {
                foreach ($view_data->html_body as $body) {
                    echo $body;
                }
            }

            _load_view('template/footer');
            ?>
        </div>
    </div>
    <audio id="backsound" controls autoplay>
        <source src="assets/audio/backsound.ogg" type="audio/ogg">
        <source src="assets/audio/backsound.mp3" type="audio/mpeg">
    </audio>

    <!-- core -->
    <script src="<?php echo base_url('assets/js/jquery.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/modernizr-2.6.2.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/jquery.easing.1.3.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/bootstrap.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/jquery.waypoints.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/sticky-kit.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/isotope.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/jquery.magnific-popup.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/owl.carousel.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/vegas.slider.min.js'); ?>"></script>
    <script src="<?php echo base_url('assets/js/main.js'); ?>"></script>
    <!-- core -->
    <script>
        $(document).ready(function() {
            $('#home').vegas({
                slides: [{
                    src: "assets/images/slider.jpg"
                }, {
                    src: "assets/images/slider2.jpg"
                }, {
                    src: "assets/images/slider3.jpg"
                }, {
                    src: "assets/images/slider4.jpg"
                }],
                overlay: true,
                transition: 'fade2',
                animation: 'kenburnsDownLeft',
                transitionDuration: 1000,
                delay: 10000,
                animationDuration: 10000
            });
        });
    </script>

    <?php
    if (isset($view_data->script_src)) {
        foreach ($view_data->script_src as $script) {
            echo $script;
        }
    }
    ?>
</body>

</html>