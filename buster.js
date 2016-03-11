var Buster = function() {};

Buster.prototype.getHeaders = function(URL) {
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


Buster.prototype.headersTest = function(URL) {
  this.getHeaders(URL).then(function(response) {
    // check if URL passes X-Frame-Options Test
    var pass = false;
    switch(response[0]) {
      case 'DENY':
      case 'SAMEORIGIN':
        pass = true;
        break;
    }
    return pass || (Boolean(response[1]) && Boolean(response[2]));
  }, function(error) {
    console.error('Test Error', error);
  });
};

Buster.prototype.iframeTest = function(URL, element) {
  if (element.contentWindow.location.href.indexOf(URL) > -1) {
    return false;
  }
  return true;
};

module.exports = new Buster();
