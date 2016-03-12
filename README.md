# Buster
[![npm status](https://img.shields.io/npm/v/frame-buster.svg)](https://www.npmjs.org/package/frame-buster)
[![GitHub release](https://img.shields.io/github/release/nathanchapman/buster.svg)](https://github.com/nathanchapman/buster/releases)
[![npm downloads](https://img.shields.io/npm/dt/frame-buster.svg)](https://www.npmjs.org/package/frame-buster)
[![GitHub license](https://img.shields.io/github/license/nathanchapman/buster.svg)](https://github.com/nathanchapman/buster/blob/master/LICENSE)

An npm package that detects improper iframe busting code. Also included are an electron application and a Chrome extension.

##Example
```javascript
window.BUSTER = require('buster.js');

var url = ...
var iframe = document.getElementById('frame');

var passedHeaderTest = window.BUSTER.headersTest(URL);
var passediFrameTest = window.BUSTER.iframeTest(URL, iframe);
```
