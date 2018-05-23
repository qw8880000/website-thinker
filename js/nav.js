function navSwitch () {
  var $navItems = $('.nav-item > .nav-link');
  var $current = $(this);

  $navItems.removeClass('active');
  $current.addClass('active');
}
