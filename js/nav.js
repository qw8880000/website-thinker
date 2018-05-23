$(document).ready(function () {

  function navSwitch (event) {
    var $navItems = $('.nav-item > .nav-link');
    var $current = $(event.currentTarget)

    $navItems.removeClass('active');
    $current.addClass('active');
  }

  $('.nav-item > .nav-link').click(navSwitch);

});


