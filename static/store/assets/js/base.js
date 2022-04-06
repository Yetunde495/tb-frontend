

$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();

    /* trigger a click event on the list view */
    $('.toggle-list').trigger('click');

    // $('[name="star"]').on('change, click', function(){
    //     $('[name="rating"]').val(this.value);
    // })


    $(document).on('hidden.bs.modal', '#quickModal', function () {
        $('#modal-loader').hide();
        $('#product-details-container').html('');
    })

    $(document).on('click', '.btnQuickModal', function () {
        var product_id = $(this).attr("data-product-id");
        $.ajax({
            type: 'POST',
            url: `/store/details/${product_id}/`,
            data: { 'csrfmiddlewaretoken': csrf_token },
            dataType: 'json',
            success: function (response) {
                $('#modal-loader').hide();
                $('#product-details-container').html(response['details']);
                // recaliberate the slick-slider
                var timer
                timer = setTimeout(() => {
                    $('.product-details-slider').slick($('.product-details-slider').data('slick-setting'));
                    $('.product-slider-nav').slick($('.product-slider-nav').data('slick-setting'));
                }, 200);

            },
            error: function (rs, e) {
                console.log(rs.responseText);
            },
        });
    });



    var timer;
    var $qString;
    // $('.qInput').keyup(function (e) {
    $(document).on('keyup', '.qInput', function () {
        $event = this;
        $qString = $($event).val();

        clearTimeout(timer);
        timer = setTimeout(function () {
            $form = $($event).closest("form");
            $form.submit();
            // $(".search-form").submit();
        }, 1000);

    });


    // search 
    $(document).on('submit', '.search-form', function (event) {
        event.preventDefault();
        $('.product-container').empty();
        $('#content-loader').show();
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {

                $('.product-container').html(response['search']);
                $('#content-loader').hide();

                recaliberateScript();

                var url_string = window.location.href
                var url = new URL(url_string);
                var host = url.hostname;
                var newPath = '/store/search/' + converToSlug($qString);

                window.history.pushState({ path: newPath }, '', newPath);

            },
            error: function (rs, e) {
                console.log(rs.responseText);
            },
        });
    });








    loadCart();
});

// conver string to slug
const converToSlug = (text) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

const addToCart = (product_id, product_name, qty = 1) => {
    $.ajax({
        type: 'POST',
        url: "/store/add-to-cart/",
        data: { 'product_id': product_id, 'quantity': qty, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            if (response['login_required']) {
                Swal.fire({
                    position: 'bottom-end',
                    html: `<label class="text-dark"><a href="/accounts/login/" class="btn-link">Login</a> is required</label>`,
                    showConfirmButton: false,
                    timer: 10000,
                    timerProgressBar: true,
                });
                return
            }
            Swal.fire({
                position: 'bottom-end',
                html: `<span class="text-light">${response['result']}</span>`,
                showConfirmButton: false,
                toast: true,
                background: 'green',
                padding: '1.5em',
                timer: 4500,
                timerProgressBar: true,
            });
            loadCart();
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });
}

const addToCart_Details = (product_id, product_name, qty = 1/*$('#qty').val()*/) => {
    $.ajax({
        type: 'POST',
        url: "/store/add-to-cart/",
        data: { 'product_id': product_id, 'quantity': qty, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            if (response['login_required']) {
                Swal.fire({
                    position: 'bottom-end',
                    html: `<label class="text-dark"><a href="/accounts/login/" class="btn-link">Login</a> is required</label>`,
                    showConfirmButton: false,
                    timer: 10000,
                    timerProgressBar: true,
                });
                return
            }
            Swal.fire({
                position: 'top-end',
                html: `<span class="text-light">${response['result']}</span>`,
                showConfirmButton: false,
                toast: true,
                background: 'green',
                padding: '1.5em',
                timer: 4500,
                timerProgressBar: true,
            });
            loadCart(); // function declared in base template
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });
}



const loadCart = () => {
    $.ajax({
        type: 'POST',
        url: "/store/add-to-cart/",
        data: { 'get-products-in-cart': true, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            if (response['login_required']) {
                // console.log("Login required");
                return
            }
            $('#countItemsMobile').text(response['cart-count']);
            $('#countItems').text(response['cart-count']);
            $('#totalPrice').text(response['total_price']);
            $('#cart-dropdown-items').html(response['productsincart']);
            $('#mobile-cart-dropdown-items').html(response['productsincart']);
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });
}


const remove_from_cart = (cart_id, product_name) => {
    $.ajax({
        type: 'POST',
        url: "/store/add-to-cart/",
        data: { 'remove-from-cart': true, 'cart-id': cart_id, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            Swal.fire({
                position: 'bottom-start',
                html: `<span class="text-light">Removed '${product_name}' from cart successfully</span>`,
                showConfirmButton: false,
                toast: true,
                background: '#BD0018',
                padding: '1.3em',
                timer: 4500,
                timerProgressBar: true,
            });
            loadCart();
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });
}


const filterByPriceRange = (min_price, max_price) => {
    $('.product-container').empty();
    $('#content-loader').show();

    $.ajax({
        type: 'POST',
        url: "/store/search/",
        data: { 'filter_range': true, 'min_price': min_price, 'max_price': max_price, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            $('.product-container').html(response['search']);
            $('#content-loader').hide();

            recaliberateScript();
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });
}




const addToWishlist = (product_id, product_name, qty = 1) => {
    $.ajax({
        type: 'POST',
        url: "/store/wishlists/",
        data: { 'product_id': product_id, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            if (response['login_required']) {
                Swal.fire({
                    position: 'bottom-end',
                    html: `<label class="text-dark"><a href="/accounts/login/" class="btn-link">Login</a> is required</label>`,
                    showConfirmButton: false,
                    timer: 10000,
                    timerProgressBar: true,
                });
                return
            }
            Swal.fire({
                position: 'bottom-end',
                html: `<span class="text-light">'${response['result']}'</span>`,
                showConfirmButton: false,
                toast: true,
                background: '#17A05D',
                padding: '1.5em',
                timer: 4500,
                timerProgressBar: true,
            });
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });
}




// add item to library
const addToLibrary = product_id => {
    if (!product_id) return false;

    $.ajax({
        type: 'POST',
        url: "/store/library/",
        data: { 'product_id': product_id, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            Swal.fire({
                position: 'top-start',
                html: `<span class="text-light">'${response['result']}'</span>`,
                showConfirmButton: false,
                toast: true,
                background: '#17A05D',
                padding: '1.5em',
                timer: 4500,
                timerProgressBar: true,
            });
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });
}
















$(document).on('click', '.jp-stop', function () {
    $('#playerContainer').hide();
});

playlist = false;
$path = "/media/";
var $title = "";
var $curPlayingElem = false;
$(document).on('click', '.audiobtn', function () {
    // $src = $(this).data('audio-file');
    $title = $(this).data('title');
    $product_id = $(this).data('product-id');

    $.ajax({
        type: 'POST',
        url: "/store/playlist/",
        data: { 'product_id': $product_id, 'play_audio': true, 'csrfmiddlewaretoken': csrf_token },
        dataType: 'json',
        success: function (response) {
            playlist_items = "";
            for(i in response['result']){
                // audioFile = response['result'][i].audio;
                playlist = response['result'];
                title = response['result'][i].title;
                playlist_items += '<a href="javascript:void(0)" class="d-block mb-1 text-decoration-none playlistItem" data-order="'+i+'"><i class="fa fa-music pr-2" ></i>'+ title +'</a>';
                
            }
            $('#playlist').html(playlist_items);

            $src = playlist[0].audio;
            title = $title +' - '+ playlist[0].title;
            $curPlayingElem = $('[data-order="0"]');
            $curPlayingElem.css({'color': 'goldenrod'});
            
            $play_audiobook($path, $src, title, $product_id);
        },
        error: function (rs, e) {
            console.log(rs.responseText);
        },
    });


});
// disable right clik for element
$('#jp_container_1').bind('contextmenu', function (e) {
    return false;
});






// when track is clicked
$(document).on('click', '.playlistItem', function() {
    $('.playlistItem').css({'color': 'white'});

    $curPlayingElem = $(this);
    order = $curPlayingElem.data('order');
    $src = playlist[order].audio;
    title = $title +' - '+ playlist[order].title;
    $curPlayingElem.css({'color': 'goldenrod'});

    $play_audiobook($path, $src, title, $product_id);
});





const $play_audiobook = ($path, $src, $title, $product_id) =>{
    ready = false;
    $("#jquery_jplayer_1").jPlayer("destroy");
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title: $title,
                // m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
                // oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
                mp3: $path + $src
            });
            $(this).jPlayer("play", 1);
            ready = true;
            $('#playerContainer').show();

            //add audio item to user library
            addToLibrary($product_id);
        },
        pause: function () {
            // $(this).jPlayer("clearMedia");
            // console.log('player paused');
        },
        error: function (event) {
            if (ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                // Setup the media stream again and play it.
                $(this).jPlayer("setMedia", {
                    title: $title,
                    mp3: $path + $src
                }).jPlayer("play");
            }
        },

        cssSelectorAncestor: "#jp_container_1",
        swfPath: "/static/store/assets/js/jplayer",
        supplied: $src.split('.')[1],
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true,
        ended: function() {
            $curPlayingElem.next().trigger('click');    //play next item on list
        }
    });
}
















// script in custom.js
const recaliberateScript = () => {
    $('.nice-select').niceSelect();

    /*-------------------------------------
        --> Product Sorting
    ---------------------------------------*/
    $('.product-view-mode a').on('click', function (e) {
        e.preventDefault();

        var shopProductWrap = $('.shop-product-wrap');
        var viewMode = $(this).data('target');

        $('.product-view-mode a').removeClass('active');
        $(this).addClass('active');
        shopProductWrap.removeClass('grid list grid-four').addClass(viewMode);
        if (shopProductWrap.hasClass('grid') || shopProductWrap.hasClass('grid-four')) {
            $('.product-card').removeClass('card-style-list')
        } else {
            $('.product-card').addClass('card-style-list')
        }
    });

    /*-------------------------------------
        --> Range Slider
    ---------------------------------------*/
    $(function () {
        $(".sb-range-slider").slider({
            range: true,
            min: 0,
            max: 99999,
            values: [100, 39999],
            slide: function (event, ui) {
                $("#amount").val(currencySymbol + ui.values[0] + " - " + currencySymbol + ui.values[1]);
            }
        });
        $("#amount").val(currencySymbol + $(".sb-range-slider").slider("values", 0) +
            " - " + currencySymbol + $(".sb-range-slider").slider("values", 1));
    });

    /* trigger a click event on list view */
    $('.toggle-list').trigger('click');
}


const recaliberateSbSlickSlider = () => {
    /*------------------------
        --> Slick Carousel
    ------------------------*/


    var $html = $('html');
    var $body = $('body');
    var $uptimoSlickSlider = $('.sb-slick-slider');

    /*For RTL*/
    if ($html.attr("dir") == "rtl" || $body.attr("dir") == "rtl") {
        $uptimoSlickSlider.attr("dir", "rtl");
    }

    $uptimoSlickSlider.each(function () {

        /*Setting Variables*/
        var $this = $(this),
            $setting = $this.data('slick-setting') ? $this.data('slick-setting') : '',
            $autoPlay = $setting.autoplay ? $setting.autoplay : false,
            $autoPlaySpeed = parseInt($setting.autoplaySpeed, 10) || 2000,
            $asNavFor = $setting.asNavFor ? $setting.asNavFor : null,
            $appendArrows = $setting.appendArrows ? $setting.appendArrows : $this,
            $appendDots = $setting.appendDots ? $setting.appendDots : $this,
            $arrows = $setting.arrows ? $setting.arrows : false,
            $prevArrow = $setting.prevArrow ? '<button class="' + ($setting.prevArrow.buttonClass ? $setting.prevArrow.buttonClass : 'slick-prev') + '"><i class="' + $setting.prevArrow.iconClass + '"></i></button>' : '<button class="slick-prev">previous</button>',
            $nextArrow = $setting.nextArrow ? '<button class="' + ($setting.nextArrow.buttonClass ? $setting.nextArrow.buttonClass : 'slick-next') + '"><i class="' + $setting.nextArrow.iconClass + '"></i></button>' : '<button class="slick-next">next</button>',
            $centerMode = $setting.centerMode ? $setting.centerMode : false,
            $centerPadding = $setting.centerPadding ? $setting.centerPadding : '50px',
            $dots = $setting.dots ? $setting.dots : false,
            $fade = $setting.fade ? $setting.fade : false,
            $focusOnSelect = $setting.focusOnSelect ? $setting.focusOnSelect : false,
            $infinite = $setting.infinite ? $setting.infinite : false,
            $pauseOnHover = $setting.pauseOnHover ? $setting.pauseOnHover : false,
            $rows = parseInt($setting.rows, 10) || 1,
            $slidesToShow = parseInt($setting.slidesToShow, 10) || 1,
            $slidesToScroll = parseInt($setting.slidesToScroll, 10) || 1,
            $swipe = $setting.swipe ? $setting.swipe : true,
            $swipeToSlide = $setting.swipeToSlide ? $setting.swipeToSlide : false,
            $variableWidth = $setting.variableWidth ? $setting.variableWidth : false,
            $vertical = $setting.vertical ? $setting.vertical : false,
            $verticalSwiping = $setting.verticalSwiping ? $setting.verticalSwiping : false,
            $rtl = $setting.rtl || $html.attr('dir="rtl"') || $body.attr('dir="rtl"') ? true : false;

        /*Responsive Variable, Array & Loops*/
        var $responsiveSetting = typeof $this.data('slick-responsive') !== 'undefined' ? $this.data('slick-responsive') : '',
            $responsiveSettingLength = $responsiveSetting.length,
            $responsiveArray = [];
        for (var i = 0; i < $responsiveSettingLength; i++) {
            $responsiveArray[i] = $responsiveSetting[i];
        }
        /*Slider Start*/
        $this.slick('unslick')


        $this.slick({
            autoplay: $autoPlay,
            autoplaySpeed: $autoPlaySpeed,
            asNavFor: $asNavFor,
            appendArrows: $appendArrows,
            appendDots: $appendDots,
            arrows: $arrows,
            dots: $dots,
            centerMode: $centerMode,
            centerPadding: $centerPadding,
            fade: $fade,
            focusOnSelect: $focusOnSelect,
            infinite: $infinite,
            pauseOnHover: $pauseOnHover,
            rows: $rows,
            slidesToShow: $slidesToShow,
            slidesToScroll: $slidesToScroll,
            swipe: $swipe,
            swipeToSlide: $swipeToSlide,
            variableWidth: $variableWidth,
            vertical: $vertical,
            verticalSwiping: $verticalSwiping,
            rtl: $rtl,
            prevArrow: $prevArrow,
            nextArrow: $nextArrow,
            responsive: $responsiveArray
        });

    });

}