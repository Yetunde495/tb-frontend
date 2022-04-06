/* global Pace, ScrollMagic, Linear */

(function($){
    "use strict";
    
    var $document = $(document),
        $body = $('body'),
        $window = $(window),
        $htmlBody = $('html, body'),
        $body = $('body'),
        $header = $('header'),
        $navbarCollapse = $('.navbar-collapse'),
        $pageScrollLink = $('.page-scroll'),
        $scrollToTop = $('.scroll-to-top'),
        scrollSpyTarget = '#navigation',
        scrollSpyOffsetBreakPoint = 1199,
        scrollSpyOffset = 90,
        scrollSpyOffsetMobile = 110;
    
    
    /*
    * Preloader
    */
   
    Pace.on('start', function(){
        var $paceProgress = $('.pace-progress');
        $paceProgress.addClass($body.data('preloader-color'));
    });
    
    Pace.start();
    
    
    /*
    * Window load
    */
   
    $window.on('load', function(){
        
        // Bootstrap scrollspy
        var ww = Math.max($window.width(), window.innerWidth);
        $body.scrollspy({    
            target: scrollSpyTarget,
            offset: ww > scrollSpyOffsetBreakPoint ? scrollSpyOffset : scrollSpyOffsetMobile
        });
    });
    
    
    /*
    * Document ready
    */
   
    $document.ready(function() {
        
        /*
        * Window resize
        */
       
        $window.on('resize', function(){
            
            // Bootstrap scrollspy
            var dataScrollSpy = $body.data('bs.scrollspy'),
                ww = Math.max($window.width(), window.innerWidth),
                offset = ww > scrollSpyOffsetBreakPoint ? scrollSpyOffset : scrollSpyOffsetMobile;
        
            dataScrollSpy._config.offset = offset;
            $body.data('bs.scrollspy', dataScrollSpy);
            $body.scrollspy('refresh');
        });
        
        
        /*
        * Window scroll
        */
       
        $window.on('scroll', function(){
        
            if ($document.scrollTop() > scrollSpyOffset) {
                // Shrink navigation
                $header.addClass('shrink');
                
                // Scroll to top
                $scrollToTop.addClass('show');
                
            }
            else {
                // Shrink navigation
                $header.removeClass('shrink');
                
                // Scroll to top
                $scrollToTop.removeClass('show');
            }
        });
        
        
        // Page scroll
        $pageScrollLink.on('click', function(e){
            var anchor = $(this),
                target = anchor.attr('href');
            pageScroll(target);
            e.preventDefault();
        });
        
        function pageScroll(target){
            var ww = Math.max($window.width(), window.innerWidth),
                    offset = ww > scrollSpyOffsetBreakPoint ? scrollSpyOffset : scrollSpyOffsetMobile;
            
            $htmlBody.stop().animate({
                scrollTop: $(target).offset().top - (offset - 1)
            }, 1000, 'easeInOutExpo');
            
            // Automatically retract the navigation after clicking on one of the menu items.
            $navbarCollapse.collapse('hide');
        };
        
        
        // Modal - Video
        var $modalVideo = $('#modal-video'),
            $modalIframe = $modalVideo.find('iframe'),
            iframeSrc = $modalIframe.attr('src');
            
        $modalVideo.on('hidden.bs.modal', function(){
            $modalIframe.attr('src', iframeSrc);
        });
        
        
        // Countdown
        if ($.fn.countdown){
            var $clock = $('#clock'),
                untilDate = $clock.data('until-date');

            $clock.countdown(untilDate, function(e){
                $(this).html(e.strftime(''
                    + '<div class="col-4 col-sm-3 text-white"><span class="d-block font-alt font-weight-bold text-extra-large-2 text-md-extra-large-3">%D</span><span class="d-block font-weight-bold h5 letter-spacing-2 mt-3 text-gray-200 text-uppercase">Days</span></div>'
                    + '<div class="col-4 col-sm-3 text-white"><span class="d-block font-alt font-weight-bold text-extra-large-2 text-md-extra-large-3">%H</span><span class="d-block font-weight-bold h5 letter-spacing-2 mt-3 text-gray-200 text-uppercase">Hours</span></div>'
                    + '<div class="col-4 col-sm-3 text-white"><span class="d-block font-alt font-weight-bold text-extra-large-2 text-md-extra-large-3">%M</span><span class="d-block font-weight-bold h5 letter-spacing-2 mt-3 text-gray-200 text-uppercase">Minutes</span></div>'
                    + '<div class="col-4 col-sm-3 d-none d-sm-block text-white"><span class="d-block font-alt font-weight-bold text-extra-large-2 text-md-extra-large-3">%S</span><span class="d-block font-weight-bold h5 letter-spacing-2 mt-3 text-gray-200 text-uppercase">Seconds</span></div>'));
            });
        }
        
        
        // Count to
        var $timer = $('.timer');
        $timer.one('inview', function(isInView){
            if (isInView) {
                $(this).countTo();
            }
        });
        
        
        // BG Parallax
        var $bgImgParallax = $('.bg-img-parallax');
        if (typeof ScrollMagic !== 'undefined' && $bgImgParallax.length > 0) {
            
            // Init controller
            var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: 'onEnter', duration: '200%'}});
                
            $bgImgParallax.each(function(){
                var selector = '#' + $(this).attr('id');
                
                // Build scenes
                new ScrollMagic.Scene({triggerElement: selector})
                    .setTween(selector + ' > .bg-parallax', {y: '80%', ease: Linear.easeNone})
                    .addTo(controller);
            });
        }
        
        
        // BG Slideshow
        var $bgSlideshow = $('.bg-slideshow');
        if ($.fn.flexslider && $bgSlideshow.length > 0) {
            $bgSlideshow.each(function(){
                var $flexslider = $(this).find('.flexslider');
                $flexslider.flexslider({
                    selector: '.slides > .bg-img-cover',
                    easing: 'linear',
                    slideshowSpeed: 4000,
                    animationSpeed: 700,
                    controlNav: false,
                    directionNav: true,
                    prevText: '',
                    nextText: '',
                    keyboard: false,
                    pauseOnAction: true,
                    touch: false,
                    after: function(slider){
                        if (!slider.playing){
                            slider.play();
                        }
                    }
                });
            });
        }
        
        
        // BG Video - Vimeo
        var $bgVimeo = $('.bg-vimeo');
        if ($.fn.vimeo_player && $bgVimeo.length > 0) {
            $bgVimeo.each(function(){
                $(this).vimeo_player({
                    containment: 'self',
                    autoPlay: true, 
                    mute: true, 
                    startAt: 0, 
                    opacity: 1,
                    showControls: false,
                    showYTLogo: false
                });
            });
        }
        
        
        // BG Video - YouTube
        var $bgYouTube = $('.bg-youtube');
        if ($.fn.YTPlayer && $bgYouTube.length > 0) {
            $bgYouTube.each(function(){
                var $player = $(this).find('.player');
                $player.YTPlayer({
                    containment: 'self',
                    autoPlay: true, 
                    mute: true, 
                    startAt: 0, 
                    opacity: 1,
                    showControls: false,
                    showYTLogo: false
                });
            });
        }
        
        
        // Form - Contact
        var $formContact = $('#form-contact'),
            $btnFormContact = $('#btn-form-contact');
        
        $btnFormContact.on('click', function(e){
            $formContact.validate();
            if ($formContact.valid()) {
                send_mail($formContact, $btnFormContact);
            }
            e.preventDefault();
        });
        
        
        // Send mail
        function send_mail($form, $btnForm){
            var defaultMessage = $btnForm.html(),
                sendingMessage = 'Loading..',
                errorMessage = 'Error Sending',
                okMessage = 'Email Sent';
            
            $btnForm.html(sendingMessage);
            
            $.ajax({
                url: $form.attr('action'),
                type: 'post',
                dataType: 'json',
                data: $form.serialize(),
                success: function(data){
                    if (data === true) {
                        $btnForm.html(okMessage);
                        $form.find('input[type="text"], input[type="email"], textarea').val('');
                    }
                    else {
                        $btnForm.html(errorMessage);
                    }

                    setTimeout(function(){
                        $btnForm.html(defaultMessage);
                    }, 3000);
                },
                error: function(xhr, err){
                    $btnForm.html(errorMessage);

                    setTimeout(function(){
                        $btnForm.html(defaultMessage);
                    }, 3000);
                }
            });
        }
        
        
        // Form - Subscription
        var $formSubscribe = $('#mc-embedded-subscribe-form'),
            $formSubscribeLabel = $formSubscribe.find('label');
            
        $formSubscribe.ajaxChimp({
            callback: ajaxChimpCallBack,
            url: $(this).attr('action')
        });
        
        function ajaxChimpCallBack(response) {
            setTimeout(function(){
                $formSubscribeLabel.removeClass('error valid');
                
                if (response.result === 'success') {
                    $formSubscribe.find('input[type="text"], input[type="email"]').val('');
                }
            }, 3000);
        }
    });
})(jQuery);