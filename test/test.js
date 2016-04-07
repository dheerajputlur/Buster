var chai = require('chai'),
assert = chai.assert,
expect = chai.expect,
should = chai.should(),
busted = require('../busted.js');

describe('removeProtocolFromURL', function() {
  describe('removes protocol from a given URL', function () {
    it('should remove http:// from the URL', function (done) {
      var URL = "http://facebook.com";
      expect(busted.removeProtocolFromURL(URL)).to.equal('facebook.com');
      done();
    });
    it('should remove https:// from the URL', function (done) {
      var URL = "https://facebook.com";
      expect(busted.removeProtocolFromURL(URL)).to.equal('facebook.com');
      done();
    });
    it('should remove www. from the URL', function (done) {
      var URL = "www.facebook.com";
      expect(busted.removeProtocolFromURL(URL)).to.equal('facebook.com');
      done();
    });
    it('should remove http(s):// and www. from the URL', function (done) {
      var URL = "http://www.facebook.com";
      expect(busted.removeProtocolFromURL(URL)).to.equal('facebook.com');
      done();
    });
  });
});

describe('standardizeURL', function() {
  describe('standardizes URL with http protocol if missing', function () {
    it('should do nothing if http:// is present', function (done) {
      var URL = "http://www.facebook.com";
      expect(busted.standardizeURL(URL)).to.equal('http://www.facebook.com');
      done();
    });
    it('should do nothing if https:// is present', function (done) {
      var URL = "https://www.facebook.com";
      expect(busted.standardizeURL(URL)).to.equal('https://www.facebook.com');
      done();
    });
    it('should add http:// if protocol is missing', function (done) {
      var URL = "facebook.com";
      expect(busted.standardizeURL(URL)).to.equal('http://facebook.com');
      done();
    });
  });
});

// describe('iframeTest', function() {
//   describe('checks if iframe\'s location is equal to a given URL', function () {
//     it('should do nothing if http:// is present', function (done) {
//       var URL = "http://www.facebook.com";
//       expect(busted.standardizeURL(URL)).to.equal('http://www.facebook.com');
//       done();
//     });
//     it('should do nothing if https:// is present', function (done) {
//       var URL = "https://www.facebook.com";
//       expect(busted.standardizeURL(URL)).to.equal('https://www.facebook.com');
//       done();
//     });
//     it('should add http:// if protocol is missing', function (done) {
//       var URL = "facebook.com";
//       expect(busted.standardizeURL(URL)).to.equal('http://facebook.com');
//       done();
//     });
//   });
// });
