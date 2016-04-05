var Busted = function() {};

var XMLHttpRequest = XMLHttpRequest || require("xmlhttprequest").XMLHttpRequest;

Busted.prototype.getHeaders = function(URL) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);

    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve([ xhr.getResponseHeader('X-Frame-Options'),
                  xhr.getResponseHeader('Content-Security-Policy'),
                  xhr.getResponseHeader('X-Content-Security-Policy')
                ]);
      } else {
        reject(Error(xhr.statusText));
      }
    };

    // Handle network errors
    xhr.onerror = function() {
      reject(Error('Network Error'));
    };

    xhr.send(null);
  });
};

Busted.prototype.removeProtocolFromURL = function(URL) {
  return String(URL).replace(/^(https?:\/\/)?(www\.)?/,'');
};


Busted.prototype.headersTest = function(URL, callback) {
  this.getHeaders(URL).then(function(response) {
    // check if URL passes X-Frame-Options Test
    var pass = false;
    switch(response[0]) {
      case 'DENY':
      case 'SAMEORIGIN':
        pass = true;
        break;
    }
    callback(pass || (Boolean(response[1]) && Boolean(response[2])));
  }, function(error) {
    console.error('Test Error', error);
  });
};

Busted.prototype.iframeTest = function(URL, frameElement, excludeString) {
  var baseURL = this.removeProtocolFromURL(URL);
  var frameURL = this.removeProtocolFromURL(frameElement.contentWindow.location.href);

  if (excludeString && frameURL.indexOf(excludeString) > -1) {
    return true;
  }
  else if (frameURL.indexOf(baseURL) > -1) {
    return false;
  }
  return true;
};

module.exports = new Busted();
