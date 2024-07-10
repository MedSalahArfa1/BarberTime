(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

})(jQuery);

document.addEventListener("DOMContentLoaded", function() {
    // Get all nav links
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Function to remove active class from all links
    function removeActiveClasses() {
        navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
    }

    // Add click event listener to each nav link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Remove active class from all links
            removeActiveClasses();
            // Add active class to the clicked link
            link.classList.add('active');
        });
    });
});
