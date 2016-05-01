var busted = require('busted');
busted.headersTest('https://www.facebook.com', function(URL, passed) {
  console.log(URL + (passed ? ' passed ' : ' failed ') + 'the headers test.');
});
