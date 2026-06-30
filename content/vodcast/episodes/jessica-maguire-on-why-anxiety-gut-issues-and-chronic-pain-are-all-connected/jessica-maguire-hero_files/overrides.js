$( document ).ready(function() {

    $( "body" ).on( "click", 'a[href="#two-step"]', function() {
        $('#two-step').addClass('modal--open');
        $('html').addClass('stop-scroll--html');
        $('body').addClass('stop-scroll--body');
    });
    
    $( "body" ).on( "click", '#two-step .close-x', function() {
        $('#two-step').removeClass('modal--open');
        $('html').removeClass('stop-scroll--html');
        $('body').removeClass('stop-scroll--body');
    });
});



/*
  Responsive Menu
------------------------------------------------------------------------*/
jQuery(document).ready(function($) {
  "use strict";
  
  var ph1_responsive_menu = $(".responsive-menu");
  
  $('body').on( "click", 'a.responsive-menu-hand', function() {    
    if($(".responsive-menu").hasClass('active')){
      $(".responsive-menu").slideUp();
      $(".responsive-menu").removeClass('active');
      $("body").removeClass('mobile-menu-active');
    }else{
      $(".responsive-menu").slideDown();
      $(".responsive-menu").addClass('active');
      $("body").addClass('mobile-menu-active');
    }
    return false;
  });
  
  $('body').on( "click", 'a.responsive-menu-close', function() {
    $(".responsive-menu").slideUp();
    $(".responsive-menu").removeClass('active');
    $("body").removeClass('mobile-menu-active');
  });
});

jQuery(window).scroll(function() {
  "use strict";
  
  var sa_body_scroll = jQuery(document).scrollTop();
      
  if (sa_body_scroll > 50) {
    jQuery('.pf4_site_header').addClass('active');
  }else if(sa_body_scroll < 50){
    jQuery('.pf4_site_header').removeClass('active');
  }
});



/*
  Section 4 slider
----------------------------------------*/
jQuery(document).ready(function($) {
  "use strict";

  $('.via3_cts').slick({
      speed: 5000,
      autoplay: true,
      autoplaySpeed: 0,
      centerMode: true,
      cssEase: 'linear',
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      infinite: true,
      arrows: false,
      buttons: false
    });

    $('.via5_testimonal').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      fade: true,
      adaptiveHeight: true,
      prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><span class="svg"><svg xmlns="http://www.w3.org/2000/svg" width="43.405" height="14.601" viewBox="0 0 43.405 14.601"><g id="Group_37" data-name="Group 37" transform="translate(0 2.5)"><line id="Line_26" data-name="Line 26" x2="30.404" transform="translate(0 4.801)" fill="none" stroke="#191414" stroke-width="1"/><g id="Polygon_1" data-name="Polygon 1" transform="translate(43.405 -2.5) rotate(90)" fill="none"><path d="M7.3,0l7.3,13H0Z" stroke="none"/><path d="M 7.300659656524658 2.042372703552246 L 1.708418846130371 12.00109958648682 L 12.89290046691895 12.00109958648682 L 7.300659656524658 2.042372703552246 M 7.300659656524658 -9.5367431640625e-07 L 14.60131931304932 13.00109958648682 L 0 13.00109958648682 L 7.300659656524658 -9.5367431640625e-07 Z" stroke="none" fill="#191414" class="p"/></g></g></svg></span></button>',
      nextArrow:'<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><span class="svg"><svg xmlns="http://www.w3.org/2000/svg" width="43.405" height="14.601" viewBox="0 0 43.405 14.601"><g id="Group_37" data-name="Group 37" transform="translate(0 2.5)"><line id="Line_26" data-name="Line 26" x2="30.404" transform="translate(0 4.801)" fill="none" stroke="#191414" stroke-width="1"/><g id="Polygon_1" data-name="Polygon 1" transform="translate(43.405 -2.5) rotate(90)" fill="none"><path d="M7.3,0l7.3,13H0Z" stroke="none"/><path d="M 7.300659656524658 2.042372703552246 L 1.708418846130371 12.00109958648682 L 12.89290046691895 12.00109958648682 L 7.300659656524658 2.042372703552246 M 7.300659656524658 -9.5367431640625e-07 L 14.60131931304932 13.00109958648682 L 0 13.00109958648682 L 7.300659656524658 -9.5367431640625e-07 Z" stroke="none" fill="#191414"" class="p"/></g></g></svg></span></button>'
    });

});


jQuery(document).ready(function($) {
    const counterUp = window.counterUp.default
    const callback = entries => {
    	entries.forEach( entry => {
    		const el = entry.target
    		if ( entry.isIntersecting && ! el.classList.contains( 'is-visible' ) ) {
    			counterUp( el, {
    				duration: 2000,
    				delay: 16,
    			} )
    			el.classList.add( 'is-visible' )
    		}
    	} )
    }
    const IO = new IntersectionObserver( callback, { threshold: 1 } )
    const el = document.querySelector( '.counter_1' )
    IO.observe( el )
    
    const el2 = document.querySelector( '.counter_2' )
    IO.observe( el2 )
    
    const el3 = document.querySelector( '.counter_3' )
    IO.observe( el3 )
    
    const el4 = document.querySelector( '.counter_4' )
    IO.observe( el4 )
});