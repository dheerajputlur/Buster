function setNavigation() {
  var path = window.location.pathname;
  path = path.replace(/\/$/, "");
  path = decodeURIComponent(path);

  $('nav a').each(function() {
    var href = $(this).attr('href');
    if (path.substring(path.length - href.length, path.length) === href) {
      $(this).closest('li').addClass('active');
    }
  });
}
$(function() {
  $('.back-to-top').hide();
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
$('#url').keyup(function (e) {
    if (e.keyCode == 13) {
      runAttacks();
    }
});
$('#attack').click(function() {
  runAttacks();
});

function fail(div) {
  $(div.find('.status')).html('<p class=\'red\'>Fail</p>');
}

function pass(div) {
  $(div.find('.status')).html('<p class=\'green\'>Pass</p>');
}

function runAttacks() {
  $('.status').html('');
  $('#test2 iframe').attr('src', '');
  window.BUSTER.headersTest($('#url').val(), runTest);
  $('#test2 iframe').attr('src', $('#url').val());
  $('#test3 iframe').attr('src', 'iframe.html?src=' + $('#url').val());
}

function runTest(passed, test) {
  test = test || 'test1';
  if (test.indexOf('#') !== 0) {
    test = "#" + test;
  }
  if (passed) {
    pass($(test));
  }
  else {
    fail($(test));
  }
}

$('#test2 iframe').on('load', function() {
  runTest(window.BUSTER.iframeTest($('#url').val(), this), 'test2');
});

$('#test3 iframe').on('load', function() {
  runTest(window.BUSTER.iframeTest($('#url').val(), this, 'iframe.html?src='), 'test3');
});
