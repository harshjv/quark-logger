(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("path"), require("electron"));
	else if(typeof define === 'function' && define.amd)
		define(["path", "electron"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("path"), require("electron")) : factory(root["path"], root["electron"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _path = __webpack_require__(1);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _electron = __webpack_require__(2);
	
	var _index = __webpack_require__(3);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	
	_electron.app.on('ready', function () {
	  var win = new _electron.BrowserWindow({
	    width: 800,
	    height: 600,
	    fullscreen: false,
	    fullscreenable: true,
	    resizable: true
	  });
	
	  win.on('closed', function () {
	    win = null;
	  });
	
	  win.loadURL('file://' + _path2.default.join(__dirname, _index2.default));
	
	  win.webContents.once('did-finish-load', function () {
	    process.stdin.on('data', function (data) {
	      try {
	        var parsedData = JSON.parse(data);
	        win.webContents.send('log', parsedData);
	      } catch (e) {
	        console.error(data);
	      }
	    });
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f64731696c57c039fec743c5580d6040.html";

/***/ }
/******/ ])
});
;
//# sourceMappingURL=electron.bundle.js.map