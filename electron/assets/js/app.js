function setNavigation() {
  var path = window.location.pathname;
  path = path.replace(/\/$/, "");
  path = decodeURIComponent(path);

  $("nav a").each(function() {
    var href = $(this).attr('href');
    if (path.substring(path.length - href.length, path.length) === href) {
      $(this).closest('li').addClass('active');
    }
  });
}
$(function() {
  $(".back-to-top").hide();
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > $(window).height() / 5) {
      $(".back-to-top").fadeIn();
    } else {
      $(".back-to-top").fadeOut();
    }
  });
  setNavigation();
  $('nav li a').each(function() {
    var current = location.pathname;
    var $this = $(this);
    // if the current path is like this link, make it active
    if ($this.attr('href').indexOf(current) !== -1) {
      $this.addClass('active');
    }
  });
  $('#menu-button').on('click', function() {
    slideout.toggle();
  });
});
