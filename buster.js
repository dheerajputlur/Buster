var Buster = function() {};

Buster.prototype.headers = function(URL) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);

    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve([xhr.getResponseHeader('X-Frame-Options'), xhr.getResponseHeader('Content-Security-Policy')]);
      } else {
        reject(Error(xhr.statusText));
      }
    };

    // Handle network errors
    xhr.onerror = function() {
      reject(Error("Network Error"));
    };

    xhr.send(null);
  });
};


Buster.prototype.headerTest = function(URL) {
  this.headers(URL).then(function(response) {
    // check if URL passes X-Frame-Options Test
    switch(response[0]) {
      case 'DENY':
      case 'SAMEORIGIN':
        console.log("Passed", response[0]);
        break;
      default:
        console.log("Failed", response[0]);
        break;
    }
  }, function(error) {
    console.error("Test Error", error);
  });
  // ADD check if URL passes Content-Security-Policy Test
};


module.exports = new Buster();
