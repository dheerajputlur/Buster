var chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  busted = require('../busted.js');

describe('removeProtocolFromURL', function() {
  describe('removes protocol from a given URL', function() {
    it('should remove http:// from the URL', function(done) {
      expect(
        busted.removeProtocolFromURL('http://facebook.com')
      ).to.equal('facebook.com');
      done();
    });
    it('should remove https:// from the URL', function(done) {
      expect(
        busted.removeProtocolFromURL('https://facebook.com')
      ).to.equal('facebook.com');
      done();
    });
    it('should remove www. from the URL', function(done) {
      expect(
        busted.removeProtocolFromURL('www.facebook.com')
      ).to.equal('facebook.com');
      done();
    });
    it('should remove http(s):// and www. from the URL', function(done) {
      expect(
        busted.removeProtocolFromURL('http://www.facebook.com')
      ).to.equal('facebook.com');
      done();
    });
  });
});

describe('standardizeURL', function() {
  describe('standardizes URL with http protocol if missing', function() {
    it('should do nothing if http:// is present', function(done) {
      expect(
        busted.standardizeURL('http://www.facebook.com')
      ).to.equal('http://www.facebook.com');
      done();
    });
    it('should do nothing if https:// is present', function(done) {
      expect(
        busted.standardizeURL('https://www.facebook.com')
      ).to.equal('https://www.facebook.com');
      done();
    });
    it('should add http:// if protocol is missing', function(done) {
      expect(
        busted.standardizeURL('facebook.com')
      ).to.equal('http://facebook.com');
      done();
    });
  });
});

describe('iframeTest', function() {
  describe('checks if iframe\'s location is equal to a given URL', function() {
    var iframe = {
      contentWindow: {
        location: {
          href: 'http://facebook.com'
        }
      }
    };
    it('should return false if the URL was found', function(done) {
      expect(
        busted.iframeTest('http://facebook.com', iframe)
      ).to.equal(false);
      done();
    });
    it('should return false if similar host URL is found', function(done) {
      expect(
        busted.iframeTest('https://www.facebook.com', iframe)
      ).to.equal(false);
      done();
    });
    it('should return true if similar host URL is not found', function(done) {
      expect(
        busted.iframeTest('https://www.google.com', iframe)
      ).to.equal(true);
      done();
    });
    it('should return true if excludeString is present', function(done) {
      iframe.contentWindow.location.href = '/busted/electron/iframe.html?src=http://www.facebook.com';
      expect(
        busted.iframeTest('https://www.facebook.com', iframe, 'iframe.html?src=')
      ).to.equal(true);
      done();
    });
    it('should return false if excludeString is not found and URL is found', function(done) {
      iframe.contentWindow.location.href = '/busted/electron/iframe.html?src=http://www.facebook.com';
      expect(
        busted.iframeTest('https://www.facebook.com', iframe, 'iframe.php?src=')
      ).to.equal(false);
      done();
    });
  });
});

describe('headersTest', function() {
  this.timeout(15000);
  var testHeaders = function(website, expectation) {
    describe('checks if ' + website + ' has X-Frame-Options or Content-Security-Policy correctly set', function() {
      var pass;
      before(function(done) {
        var URL = 'http://' + website;
        var cb = function(passed) {
          pass = passed;
          done();
        };
        busted.headersTest(URL, cb);
      });
      it('should ' + (expectation ? 'pass' : 'fail'), function() {
        if (typeof pass === 'object') {
          expect(pass).to.deep.equal(expectation);
        }
        else {
          expect(pass).to.equal(expectation);
        }
      });
    });
  };
  testHeaders('google.com', true);
  testHeaders('facebook.com', true);
  testHeaders('twitter.com', true);
  testHeaders('github.com', false);
  testHeaders('ebay.com', false);
  testHeaders('facebook.com/something-random.html', Error('Not Found'));
});
