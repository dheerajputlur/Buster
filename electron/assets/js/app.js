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

var outputFile = null;

function fail(div) {
    $($(div).find('.status')).html('<p class=\'red\'>Fail</p> <small><a href="documentation.html' + div + '">More Info</a></small>');
}

function pass(div) {
    $($(div).find('.status')).html('<p class=\'green\'>Pass</p>');
}

function error(div) {
    $($(div).find('.status')).html('<p class=\'yellow\'>Test did not run</p> <small><a href="documentation.html' + div + '">More Info</a></small>');
}

function runTest(url, passed, test) {
    test = test || 'test1';
    if (test.indexOf('#') !== 0) {
        test = "#" + test;
    }
    switch (passed) {
        case true:
            pass(test);
            break;
        case false:
            fail(test);
            break;
        default:
            error(test);
            break;
    }
}

$('#test2 iframe').load(function(e) {
    // console.log(e.target.contentDocument.URL);
    // if (e.target.contentDocument.URL.indexOf($('#url').val()) < 0) {
    //   $('#test2 iframe').attr('src', 'about:blank');
    // }
    var url = $('#url').val();
    runTest(url, window.BUSTED.iframeTest(url, this), 'test2');
});

$('#test3 iframe').load(function() {
    var childFrame = $(this).contents().find('#iframe');
    var url = $('#url').val();
    var parentFramePassed = window.BUSTED.iframeTest(url, this, 'iframe.html?src=');

    var childFramePassed = (function() {
        return window.BUSTED.iframeTest(url, childFrame[0]);
    });

    childFrame.load(function() {
        runTest(url, childFramePassed() && parentFramePassed, 'test3');
    });
});

function runAttacks() {
    $('.status').html('');
    var url = window.BUSTED.standardizeURL($('#url').val());
    window.BUSTED.headersTest(url, runTest);
    $('#test2 iframe').attr('src', url);
    $('#test3 iframe').attr('src', 'iframe.html?src=' + url);
    runTest(url, error, 'test4');
}

window.onbeforeunload = function() {
  runTest(false, 'test4');
  // Returns a deceptive message to trick the user into staying
  return "Are you sure you want to navigate away from PayPal.com?";
};

function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var appendToOutput = function(url, passed) {
      if (!passed) {
        $('.results').append(url +
          ' failed the headers test. <a href="attacker.html?url=' +
          url + '">Test Further</a> <br>');
      }
    };
    $.get(file.path, function(data) {
        var lines = data.replace(/,\s*/g , '\n').split('\n');
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] !== '') {
              window.BUSTED.headersTest(lines[i], appendToOutput);
            }
        }
    });
}
if (document.getElementById('file')) {
  document.getElementById('file').addEventListener('change', handleFileSelect, false);
}
