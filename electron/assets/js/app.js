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

$('#url').keyup(function(e) {
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

function error(div) {
    $(div.find('.status')).html('<p class=\'yellow\'>Test did not run</p>');
}

function runTest(passed, test) {
    test = test || 'test1';
    if (test.indexOf('#') !== 0) {
        test = "#" + test;
    }
    switch (passed) {
        case true:
            pass($(test));
            break;
        case false:
            fail($(test));
            break;
        default:
            error($(test));
            break;
    }
}

$('#test2 iframe').load(function(e) {
    // console.log(e.target.contentDocument.URL);
    // if (e.target.contentDocument.URL.indexOf($('#url').val()) < 0) {
    //   $('#test2 iframe').attr('src', 'about:blank');
    // }
    runTest(window.BUSTED.iframeTest($('#url').val(), this), 'test2');
});

$('#test2 iframe').error(function(e) {
    console.log(e);
});

$('#test3 iframe').load(function() {
    var childFrame = $(this).contents().find('#iframe');
    var parentFramePassed = window.BUSTED.iframeTest($('#url').val(), this, 'iframe.html?src=');

    var childFramePassed = (function() {
        return window.BUSTED.iframeTest($('#url').val(), childFrame[0]);
    });

    childFrame.load(function() {
        runTest(childFramePassed() && parentFramePassed, 'test3');
    });
});

function runAttacks() {
    $('.status').html('');
    window.BUSTED.headersTest($('#url').val(), runTest);
    $('#test2 iframe').attr('src', window.BUSTED.standardizeURL($('#url').val()));
    $('#test3 iframe').attr('src', 'iframe.html?src=' + window.BUSTED.standardizeURL($('#url').val()));
    runTest(error, 'test4');
}

window.onbeforeunload = function() {
  runTest(false, 'test4');
  return "Are you sure you want to navigate away from PayPal.com?";
};
