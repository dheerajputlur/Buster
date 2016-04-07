# Busted
[![npm version](https://img.shields.io/npm/v/busted.svg)](https://www.npmjs.org/package/busted)
[![npm downloads](https://img.shields.io/npm/dt/busted.svg)](https://www.npmjs.org/package/busted)
[![Travis CI](https://travis-ci.org/nathanchapman/busted.svg)](https://travis-ci.org/nathanchapman/busted)
[![Coverage Status](https://coveralls.io/repos/github/nathanchapman/busted/badge.svg?branch=master)](https://coveralls.io/github/nathanchapman/busted?branch=master)
[![Code Climate Grade](https://codeclimate.com/github/nathanchapman/busted/badges/gpa.svg)](https://codeclimate.com/github/nathanchapman/busted)
[![bitHound Overall Score](https://www.bithound.io/github/nathanchapman/busted/badges/score.svg)](https://www.bithound.io/github/nathanchapman/busted)
[![bitHound Dependencies](https://www.bithound.io/github/nathanchapman/busted/badges/dependencies.svg)](https://www.bithound.io/github/nathanchapman/busted/master/dependencies/npm)
[![GitHub license](https://img.shields.io/github/license/nathanchapman/busted.svg)](https://github.com/nathanchapman/busted/blob/master/LICENSE)

<img align="right" width="300" src="http://www.dafont.com/forum/attach/orig/5/5/554705.png">

An npm package that detects improper iframe busting code. Also included are an Electron application and a Chrome extension.

This package is currently under **_heavy_** development and is **not reliable**.


## Installation
```sh
$ npm install busted
```

## Usage
In a Node.js application (only headers test is functional):
```javascript
var busted = require('busted');
var URL = "http://www.example.com";
busted.headersTest(URL, function(passed) {
  console.log(passed);
});
```

In an Electron application (has DOM access so iframes can be tested):
```javascript
window.BUSTED = require('busted.js');

var URL = "http://www.example.com";
var iframe = document.getElementById('frame');
iframe.src = URL;

window.BUSTED.headersTest(URL, function(passed) { 
  console.log(URL + ": " + (passed ? "passed" : "failed") + " the headers test.");
});

iframe.onload = function() {
  var passed = window.BUSTED.iframeTest(URL, iframe);
  console.log(URL + ": " + (passed ? "passed" : "failed") + " the iframe test.");
}
```
