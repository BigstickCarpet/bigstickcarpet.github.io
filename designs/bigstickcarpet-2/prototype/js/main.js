// One Page Scroll
$(function(){

   $.scrollIt({
     upKey: 38,             // key code to navigate to the next section
     downKey: 40,           // key code to navigate to the previous section
     easing: 'linear',      // the easing function for animation
     scrollTime: 600,       // how long (in ms) the animation takes
     activeClass: 'active', // class given to the active nav element
     onPageChange: null,    // function(pageIndex) that is called when page is changed
     topOffset: 0          // offste (in px) for fixed top navigation
   });

   var navigation = responsiveNav("foo", {
      customToggle: ".nav-toggle",
      closeOnNavClick: true
   });


});

// Velocity Animations
(function($) {




   $('.animateBanner').velocity({
      translateY: [0, 50],
      opacity: [1, 0]
   }, {
      duration: 800
   });

   $('.animatePicRight').velocity({
      translateX: [0, 100],
      opacity: [1, 0],
      waypoint: ["#ttt"]
   }, {
      duration: 800
   });

   $('.animatePicLeft').velocity({
      translateX: [0, -100],
      opacity: [1, 0]
   }, {
      duration: 800
   });

})(jQuery);

