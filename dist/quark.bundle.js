(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("path"), require("electron"), require("tty"), require("util"), require("fs"), require("net"), require("child_process"));
	else if(typeof define === 'function' && define.amd)
		define(["path", "electron", "tty", "util", "fs", "net", "child_process"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("path"), require("electron"), require("tty"), require("util"), require("fs"), require("net"), require("child_process")) : factory(root["path"], root["electron"], root["tty"], root["util"], root["fs"], root["net"], root["child_process"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_13__) {
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
	
	var _stream = __webpack_require__(4);
	
	var _stream2 = _interopRequireDefault(_stream);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var previousTime = void 0;
	
	var coerce = function coerce(val) {
	  return val instanceof Error ? val.stack || val.message : val;
	};
	var log = (0, _stream2.default)();
	
	var Quark = function Quark(namespace) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    var currentTime = new Date();
	    var diff = currentTime - (previousTime || currentTime);
	    previousTime = currentTime;
	
	    args = args.map(function (arg) {
	      return coerce(arg);
	    });
	
	    log(JSON.stringify({
	      diff: diff,
	      time: currentTime,
	      tag: namespace,
	      data: args
	    }));
	  };
	};
	
	Quark.quarkWindow = {
	  show: function show() {
	    log.showWindow();
	  }
	};
	
	module.exports = Quark;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _debug = __webpack_require__(5);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _path = __webpack_require__(1);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _xtend = __webpack_require__(12);
	
	var _xtend2 = _interopRequireDefault(_xtend);
	
	var _child_process = __webpack_require__(13);
	
	var _shellQuote = __webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var activatedWindow = false;
	
	var debug = (0, _debug2.default)('quark-logger:stream');
	
	var _process = process,
	    platform = _process.platform,
	    env = _process.env;
	
	
	var PATH_SEP = platform === 'win32' ? ';' : ':';
	var PATH_KEY = platform === 'win32' && !(env.PATH && !env.Path) ? 'Path' : 'PATH';
	var ESCAPE_CHAR = platform === 'win32' ? '^' : '\\';
	var ELECTRON_LIB = 'electron ' + _path2.default.join(__dirname, 'electron.bundle.js');
	
	var commandToString = function commandToString(cmd) {
	  return cmd.pattern || cmd.op || handleQuotes(cmd);
	};
	
	var handleQuotes = function handleQuotes(s) {
	  if (/["'\s]/.test(s)) return '"' + s.replace(/(["\\$`!])/g, '\\$1') + '"';
	  if (/["\s]/.test(s) && !/'/.test(s)) return "'" + s.replace(/(['\\])/g, '\\$1') + "'";
	  return String(s).replace(/([\\$`()!#&*|])/g, '\\$1');
	};
	
	var getNewPathVariable = function getNewPathVariable() {
	  var PATH = env[PATH_KEY];
	  var result = [];
	  var cwd = process.cwd();
	  var parent = void 0;
	
	  while (true) {
	    parent = _path2.default.join(cwd, '..');
	    result.push(_path2.default.join(cwd, 'node_modules/.bin'));
	    if (parent === cwd) return result.concat(PATH).join(PATH_SEP);
	    cwd = parent;
	  }
	};
	
	var formatAndSpawn = function formatAndSpawn(command, opts) {
	  var options = (0, _xtend2.default)({}, opts);
	  var file = void 0;
	  var args = void 0;
	
	  if (platform === 'win32') {
	    file = env.comspec || 'cmd.exe';
	    args = ['/s', '/c', '"' + command + '"'];
	    options.windowsVerbatimArguments = true;
	  } else {
	    file = '/bin/sh';
	    args = ['-c', command];
	    options.windowsVerbatimArguments = false;
	  }
	
	  if (options && options.shell) {
	    file = options.shell;
	    delete options.shell;
	  }
	
	  debug('Spawning electron', file, args, options);
	
	  return (0, _child_process.spawn)(file, args, options);
	};
	
	var handleSpawningInMainProcess = function handleSpawningInMainProcess() {
	  function Out(logs) {
	    activatedWindow ? activatedWindow(logs) : console.log(logs);
	  }
	
	  Out.showWindow = function () {
	    if (activatedWindow) return;
	
	    var parsed = (0, _shellQuote.parse)(ELECTRON_LIB, (0, _xtend2.default)({ '': '$' }), { escape: ESCAPE_CHAR }).map(commandToString).join(' ');
	
	    var overridePATH = _defineProperty({}, PATH_KEY, getNewPathVariable());
	
	    var child = formatAndSpawn(parsed, { env: (0, _xtend2.default)(env, overridePATH) });
	    activatedWindow = child.stdin.write.bind(child.stdin);
	
	    child.stdin.setEncoding('utf-8');
	    child.stdout.pipe(process.stdout);
	
	    child.on('exit', function () {
	      activatedWindow = console.log.bind(console);
	    });
	  };
	
	  return Out;
	};
	
	module.exports = function () {
	  if (typeof process === 'undefined') {
	    // Web browser
	    debug('Web browser');
	
	    return console.log.bind(console);
	  } else {
	    if (process.type === 'renderer') {
	      var _ret = function () {
	        // Renderer process
	        debug('Electron renderer process');
	
	        var _require = __webpack_require__(2),
	            ipcRenderer = _require.ipcRenderer;
	
	        return {
	          v: function v(log) {
	            return ipcRenderer.send('quark-logger:ipc', log);
	          }
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    } else {
	      var _ret2 = function () {
	        // Electron
	        debug('Electron main process');
	
	        var _require2 = __webpack_require__(2),
	            ipcMain = _require2.ipcMain;
	
	        var logger = handleSpawningInMainProcess();
	
	        ipcMain.on('quark-logger:ipc', function (event, arg) {
	          logger(arg);
	        });
	
	        return {
	          v: logger
	        };
	      }();
	
	      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	    }
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var tty = __webpack_require__(6);
	var util = __webpack_require__(7);
	
	/**
	 * This is the Node.js implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(8);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	
	/**
	 * Colors.
	 */
	
	exports.colors = [6, 2, 3, 4, 5, 1];
	
	/**
	 * The file descriptor to write the `debug()` calls to.
	 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
	 *
	 *   $ DEBUG_FD=3 node script.js 3>debug.log
	 */
	
	var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
	var stream = 1 === fd ? process.stdout :
	             2 === fd ? process.stderr :
	             createWritableStdioStream(fd);
	
	/**
	 * Is stdout a TTY? Colored output is enabled when `true`.
	 */
	
	function useColors() {
	  var debugColors = (process.env.DEBUG_COLORS || '').trim().toLowerCase();
	  if (0 === debugColors.length) {
	    return tty.isatty(fd);
	  } else {
	    return '0' !== debugColors
	        && 'no' !== debugColors
	        && 'false' !== debugColors
	        && 'disabled' !== debugColors;
	  }
	}
	
	/**
	 * Map %o to `util.inspect()`, since Node doesn't do that out of the box.
	 */
	
	var inspect = (4 === util.inspect.length ?
	  // node <= 0.8.x
	  function (v, colors) {
	    return util.inspect(v, void 0, void 0, colors);
	  } :
	  // node > 0.8.x
	  function (v, colors) {
	    return util.inspect(v, { colors: colors });
	  }
	);
	
	exports.formatters.o = exports.formatters.O = function(v) {
	  return inspect(v, this.useColors)
	    .replace(/\s*\n\s*/g, ' ');
	};
	
	/**
	 * Adds ANSI color escape codes if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = [];
	  var len = arguments.length;
	  var useColors = this.useColors;
	  var name = this.namespace;
	  for (var i = 0; i < len; i++) {
	    args.push(arguments[i]);
	  }
	
	  if (useColors) {
	    var c = this.color;
	
	    args[0] = '  \u001b[3' + c + ';1m' + name + ' '
	      + '\u001b[0m'
	      + args[0];
	    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
	  } else {
	    args[0] = new Date().toUTCString()
	      + ' ' + name + ' ' + args[0];
	  }
	  return args;
	}
	
	/**
	 * Invokes `console.error()` with the specified arguments.
	 */
	
	function log() {
	  return stream.write(util.format.apply(this, arguments) + '\n');
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  if (null == namespaces) {
	    // If you set a process.env field to null or undefined, it gets cast to the
	    // string 'null' or 'undefined'. Just delete instead.
	    delete process.env.DEBUG;
	  } else {
	    process.env.DEBUG = namespaces;
	  }
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  return process.env.DEBUG;
	}
	
	/**
	 * Copied from `node/src/node.js`.
	 *
	 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
	 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
	 */
	
	function createWritableStdioStream (fd) {
	  var stream;
	  var tty_wrap = process.binding('tty_wrap');
	
	  // Note stream._type is used for test-module-load-list.js
	
	  switch (tty_wrap.guessHandleType(fd)) {
	    case 'TTY':
	      stream = new tty.WriteStream(fd);
	      stream._type = 'tty';
	
	      // Hack to have stream not keep the event loop alive.
	      // See https://github.com/joyent/node/issues/1726
	      if (stream._handle && stream._handle.unref) {
	        stream._handle.unref();
	      }
	      break;
	
	    case 'FILE':
	      var fs = __webpack_require__(10);
	      stream = new fs.SyncWriteStream(fd, { autoClose: false });
	      stream._type = 'fs';
	      break;
	
	    case 'PIPE':
	    case 'TCP':
	      var net = __webpack_require__(11);
	      stream = new net.Socket({
	        fd: fd,
	        readable: false,
	        writable: true
	      });
	
	      // FIXME Should probably have an option in net.Socket to create a
	      // stream from an existing fd which is writable only. But for now
	      // we'll just add this hack and set the `readable` member to false.
	      // Test: ./node test/fixtures/echo.js < /etc/passwd
	      stream.readable = false;
	      stream.read = null;
	      stream._type = 'pipe';
	
	      // FIXME Hack to have stream not keep the event loop alive.
	      // See https://github.com/joyent/node/issues/1726
	      if (stream._handle && stream._handle.unref) {
	        stream._handle.unref();
	      }
	      break;
	
	    default:
	      // Probably an error on in uv_guess_handle()
	      throw new Error('Implement me. Unknown stream file type!');
	  }
	
	  // For supporting legacy API we put the FD here.
	  stream.fd = fd;
	
	  stream._isStdio = true;
	
	  return stream;
	}
	
	/**
	 * Enable namespaces listed in `process.env.DEBUG` initially.
	 */
	
	exports.enable(load());


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("tty");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug.debug = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(9);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000
	var m = s * 60
	var h = m * 60
	var d = h * 24
	var y = d * 365.25
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function (val, options) {
	  options = options || {}
	  var type = typeof val
	  if (type === 'string' && val.length > 0) {
	    return parse(val)
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ?
				fmtLong(val) :
				fmtShort(val)
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
	}
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = String(str)
	  if (str.length > 10000) {
	    return
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
	  if (!match) {
	    return
	  }
	  var n = parseFloat(match[1])
	  var type = (match[2] || 'ms').toLowerCase()
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n
	    default:
	      return undefined
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd'
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h'
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm'
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's'
	  }
	  return ms + 'ms'
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms'
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) {
	    return
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's'
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = extend
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	function extend() {
	    var target = {}
	
	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]
	
	        for (var key in source) {
	            if (hasOwnProperty.call(source, key)) {
	                target[key] = source[key]
	            }
	        }
	    }
	
	    return target
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("child_process");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var json = typeof JSON !== undefined ? JSON : __webpack_require__(15);
	var map = __webpack_require__(18);
	var filter = __webpack_require__(19);
	var reduce = __webpack_require__(20);
	
	exports.quote = function (xs) {
	    return map(xs, function (s) {
	        if (s && typeof s === 'object') {
	            return s.op.replace(/(.)/g, '\\$1');
	        }
	        else if (/["\s]/.test(s) && !/'/.test(s)) {
	            return "'" + s.replace(/(['\\])/g, '\\$1') + "'";
	        }
	        else if (/["'\s]/.test(s)) {
	            return '"' + s.replace(/(["\\$`!])/g, '\\$1') + '"';
	        }
	        else {
	            return String(s).replace(/([#!"$&'()*,:;<=>?@\[\\\]^`{|}])/g, '\\$1'); 
	        }
	    }).join(' ');
	};
	
	var CONTROL = '(?:' + [
	    '\\|\\|', '\\&\\&', ';;', '\\|\\&', '[&;()|<>]'
	].join('|') + ')';
	var META = '|&;()<> \\t';
	var BAREWORD = '(\\\\[\'"' + META + ']|[^\\s\'"' + META + '])+';
	var SINGLE_QUOTE = '"((\\\\"|[^"])*?)"';
	var DOUBLE_QUOTE = '\'((\\\\\'|[^\'])*?)\'';
	
	var TOKEN = '';
	for (var i = 0; i < 4; i++) {
	    TOKEN += (Math.pow(16,8)*Math.random()).toString(16);
	}
	
	exports.parse = function (s, env, opts) {
	    var mapped = parse(s, env, opts);
	    if (typeof env !== 'function') return mapped;
	    return reduce(mapped, function (acc, s) {
	        if (typeof s === 'object') return acc.concat(s);
	        var xs = s.split(RegExp('(' + TOKEN + '.*?' + TOKEN + ')', 'g'));
	        if (xs.length === 1) return acc.concat(xs[0]);
	        return acc.concat(map(filter(xs, Boolean), function (x) {
	            if (RegExp('^' + TOKEN).test(x)) {
	                return json.parse(x.split(TOKEN)[1]);
	            }
	            else return x;
	        }));
	    }, []);
	};
	
	function parse (s, env, opts) {
	    var chunker = new RegExp([
	        '(' + CONTROL + ')', // control chars
	        '(' + BAREWORD + '|' + SINGLE_QUOTE + '|' + DOUBLE_QUOTE + ')*'
	    ].join('|'), 'g');
	    var match = filter(s.match(chunker), Boolean);
	    var commented = false;
	
	    if (!match) return [];
	    if (!env) env = {};
	    if (!opts) opts = {};
	    return map(match, function (s, j) {
	        if (commented) {
	            return;
	        }
	        if (RegExp('^' + CONTROL + '$').test(s)) {
	            return { op: s };
	        }
	
	        // Hand-written scanner/parser for Bash quoting rules:
	        //
	        //  1. inside single quotes, all characters are printed literally.
	        //  2. inside double quotes, all characters are printed literally
	        //     except variables prefixed by '$' and backslashes followed by
	        //     either a double quote or another backslash.
	        //  3. outside of any quotes, backslashes are treated as escape
	        //     characters and not printed (unless they are themselves escaped)
	        //  4. quote context can switch mid-token if there is no whitespace
	        //     between the two quote contexts (e.g. all'one'"token" parses as
	        //     "allonetoken")
	        var SQ = "'";
	        var DQ = '"';
	        var DS = '$';
	        var BS = opts.escape || '\\';
	        var quote = false;
	        var esc = false;
	        var out = '';
	        var isGlob = false;
	
	        for (var i = 0, len = s.length; i < len; i++) {
	            var c = s.charAt(i);
	            isGlob = isGlob || (!quote && (c === '*' || c === '?'));
	            if (esc) {
	                out += c;
	                esc = false;
	            }
	            else if (quote) {
	                if (c === quote) {
	                    quote = false;
	                }
	                else if (quote == SQ) {
	                    out += c;
	                }
	                else { // Double quote
	                    if (c === BS) {
	                        i += 1;
	                        c = s.charAt(i);
	                        if (c === DQ || c === BS || c === DS) {
	                            out += c;
	                        } else {
	                            out += BS + c;
	                        }
	                    }
	                    else if (c === DS) {
	                        out += parseEnvVar();
	                    }
	                    else {
	                        out += c;
	                    }
	                }
	            }
	            else if (c === DQ || c === SQ) {
	                quote = c;
	            }
	            else if (RegExp('^' + CONTROL + '$').test(c)) {
	                return { op: s };
	            }
	            else if (RegExp('^#$').test(c)) {
	                commented = true;
	                if (out.length){
	                    return [out, { comment: s.slice(i+1) + match.slice(j+1).join(' ') }];
	                }
	                return [{ comment: s.slice(i+1) + match.slice(j+1).join(' ') }];
	            }
	            else if (c === BS) {
	                esc = true;
	            }
	            else if (c === DS) {
	                out += parseEnvVar();
	            }
	            else out += c;
	        }
	
	        if (isGlob) return {op: 'glob', pattern: out};
	
	        return out;
	
	        function parseEnvVar() {
	            i += 1;
	            var varend, varname;
	            //debugger
	            if (s.charAt(i) === '{') {
	                i += 1;
	                if (s.charAt(i) === '}') {
	                    throw new Error("Bad substitution: " + s.substr(i - 2, 3));
	                }
	                varend = s.indexOf('}', i);
	                if (varend < 0) {
	                    throw new Error("Bad substitution: " + s.substr(i));
	                }
	                varname = s.substr(i, varend - i);
	                i = varend;
	            }
	            else if (/[*@#?$!_\-]/.test(s.charAt(i))) {
	                varname = s.charAt(i);
	                i += 1;
	            }
	            else {
	                varend = s.substr(i).match(/[^\w\d_]/);
	                if (!varend) {
	                    varname = s.substr(i);
	                    i = s.length;
	                } else {
	                    varname = s.substr(i, varend.index);
	                    i += varend.index - 1;
	                }
	            }
	            return getVar(null, '', varname);
	        }
	    })
	    // finalize parsed aruments
	    .reduce(function(prev, arg){
	        if (arg === undefined){
	            return prev;
	        }
	        return prev.concat(arg);
	    },[]);
	
	    function getVar (_, pre, key) {
	        var r = typeof env === 'function' ? env(key) : env[key];
	        if (r === undefined) r = '';
	
	        if (typeof r === 'object') {
	            return pre + TOKEN + json.stringify(r) + TOKEN;
	        }
	        else return pre + r;
	    }
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports.parse = __webpack_require__(16);
	exports.stringify = __webpack_require__(17);


/***/ },
/* 16 */
/***/ function(module, exports) {

	var at, // The index of the current character
	    ch, // The current character
	    escapee = {
	        '"':  '"',
	        '\\': '\\',
	        '/':  '/',
	        b:    '\b',
	        f:    '\f',
	        n:    '\n',
	        r:    '\r',
	        t:    '\t'
	    },
	    text,
	
	    error = function (m) {
	        // Call error when something is wrong.
	        throw {
	            name:    'SyntaxError',
	            message: m,
	            at:      at,
	            text:    text
	        };
	    },
	    
	    next = function (c) {
	        // If a c parameter is provided, verify that it matches the current character.
	        if (c && c !== ch) {
	            error("Expected '" + c + "' instead of '" + ch + "'");
	        }
	        
	        // Get the next character. When there are no more characters,
	        // return the empty string.
	        
	        ch = text.charAt(at);
	        at += 1;
	        return ch;
	    },
	    
	    number = function () {
	        // Parse a number value.
	        var number,
	            string = '';
	        
	        if (ch === '-') {
	            string = '-';
	            next('-');
	        }
	        while (ch >= '0' && ch <= '9') {
	            string += ch;
	            next();
	        }
	        if (ch === '.') {
	            string += '.';
	            while (next() && ch >= '0' && ch <= '9') {
	                string += ch;
	            }
	        }
	        if (ch === 'e' || ch === 'E') {
	            string += ch;
	            next();
	            if (ch === '-' || ch === '+') {
	                string += ch;
	                next();
	            }
	            while (ch >= '0' && ch <= '9') {
	                string += ch;
	                next();
	            }
	        }
	        number = +string;
	        if (!isFinite(number)) {
	            error("Bad number");
	        } else {
	            return number;
	        }
	    },
	    
	    string = function () {
	        // Parse a string value.
	        var hex,
	            i,
	            string = '',
	            uffff;
	        
	        // When parsing for string values, we must look for " and \ characters.
	        if (ch === '"') {
	            while (next()) {
	                if (ch === '"') {
	                    next();
	                    return string;
	                } else if (ch === '\\') {
	                    next();
	                    if (ch === 'u') {
	                        uffff = 0;
	                        for (i = 0; i < 4; i += 1) {
	                            hex = parseInt(next(), 16);
	                            if (!isFinite(hex)) {
	                                break;
	                            }
	                            uffff = uffff * 16 + hex;
	                        }
	                        string += String.fromCharCode(uffff);
	                    } else if (typeof escapee[ch] === 'string') {
	                        string += escapee[ch];
	                    } else {
	                        break;
	                    }
	                } else {
	                    string += ch;
	                }
	            }
	        }
	        error("Bad string");
	    },
	
	    white = function () {
	
	// Skip whitespace.
	
	        while (ch && ch <= ' ') {
	            next();
	        }
	    },
	
	    word = function () {
	
	// true, false, or null.
	
	        switch (ch) {
	        case 't':
	            next('t');
	            next('r');
	            next('u');
	            next('e');
	            return true;
	        case 'f':
	            next('f');
	            next('a');
	            next('l');
	            next('s');
	            next('e');
	            return false;
	        case 'n':
	            next('n');
	            next('u');
	            next('l');
	            next('l');
	            return null;
	        }
	        error("Unexpected '" + ch + "'");
	    },
	
	    value,  // Place holder for the value function.
	
	    array = function () {
	
	// Parse an array value.
	
	        var array = [];
	
	        if (ch === '[') {
	            next('[');
	            white();
	            if (ch === ']') {
	                next(']');
	                return array;   // empty array
	            }
	            while (ch) {
	                array.push(value());
	                white();
	                if (ch === ']') {
	                    next(']');
	                    return array;
	                }
	                next(',');
	                white();
	            }
	        }
	        error("Bad array");
	    },
	
	    object = function () {
	
	// Parse an object value.
	
	        var key,
	            object = {};
	
	        if (ch === '{') {
	            next('{');
	            white();
	            if (ch === '}') {
	                next('}');
	                return object;   // empty object
	            }
	            while (ch) {
	                key = string();
	                white();
	                next(':');
	                if (Object.hasOwnProperty.call(object, key)) {
	                    error('Duplicate key "' + key + '"');
	                }
	                object[key] = value();
	                white();
	                if (ch === '}') {
	                    next('}');
	                    return object;
	                }
	                next(',');
	                white();
	            }
	        }
	        error("Bad object");
	    };
	
	value = function () {
	
	// Parse a JSON value. It could be an object, an array, a string, a number,
	// or a word.
	
	    white();
	    switch (ch) {
	    case '{':
	        return object();
	    case '[':
	        return array();
	    case '"':
	        return string();
	    case '-':
	        return number();
	    default:
	        return ch >= '0' && ch <= '9' ? number() : word();
	    }
	};
	
	// Return the json_parse function. It will have access to all of the above
	// functions and variables.
	
	module.exports = function (source, reviver) {
	    var result;
	    
	    text = source;
	    at = 0;
	    ch = ' ';
	    result = value();
	    white();
	    if (ch) {
	        error("Syntax error");
	    }
	
	    // If there is a reviver function, we recursively walk the new structure,
	    // passing each name/value pair to the reviver function for possible
	    // transformation, starting with a temporary root object that holds the result
	    // in an empty key. If there is not a reviver function, we simply return the
	    // result.
	
	    return typeof reviver === 'function' ? (function walk(holder, key) {
	        var k, v, value = holder[key];
	        if (value && typeof value === 'object') {
	            for (k in value) {
	                if (Object.prototype.hasOwnProperty.call(value, k)) {
	                    v = walk(value, k);
	                    if (v !== undefined) {
	                        value[k] = v;
	                    } else {
	                        delete value[k];
	                    }
	                }
	            }
	        }
	        return reviver.call(holder, key, value);
	    }({'': result}, '')) : result;
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	    gap,
	    indent,
	    meta = {    // table of character substitutions
	        '\b': '\\b',
	        '\t': '\\t',
	        '\n': '\\n',
	        '\f': '\\f',
	        '\r': '\\r',
	        '"' : '\\"',
	        '\\': '\\\\'
	    },
	    rep;
	
	function quote(string) {
	    // If the string contains no control characters, no quote characters, and no
	    // backslash characters, then we can safely slap some quotes around it.
	    // Otherwise we must also replace the offending characters with safe escape
	    // sequences.
	    
	    escapable.lastIndex = 0;
	    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	        var c = meta[a];
	        return typeof c === 'string' ? c :
	            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    }) + '"' : '"' + string + '"';
	}
	
	function str(key, holder) {
	    // Produce a string from holder[key].
	    var i,          // The loop counter.
	        k,          // The member key.
	        v,          // The member value.
	        length,
	        mind = gap,
	        partial,
	        value = holder[key];
	    
	    // If the value has a toJSON method, call it to obtain a replacement value.
	    if (value && typeof value === 'object' &&
	            typeof value.toJSON === 'function') {
	        value = value.toJSON(key);
	    }
	    
	    // If we were called with a replacer function, then call the replacer to
	    // obtain a replacement value.
	    if (typeof rep === 'function') {
	        value = rep.call(holder, key, value);
	    }
	    
	    // What happens next depends on the value's type.
	    switch (typeof value) {
	        case 'string':
	            return quote(value);
	        
	        case 'number':
	            // JSON numbers must be finite. Encode non-finite numbers as null.
	            return isFinite(value) ? String(value) : 'null';
	        
	        case 'boolean':
	        case 'null':
	            // If the value is a boolean or null, convert it to a string. Note:
	            // typeof null does not produce 'null'. The case is included here in
	            // the remote chance that this gets fixed someday.
	            return String(value);
	            
	        case 'object':
	            if (!value) return 'null';
	            gap += indent;
	            partial = [];
	            
	            // Array.isArray
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	                
	                // Join all of the elements together, separated with commas, and
	                // wrap them in brackets.
	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	            
	            // If the replacer is an array, use it to select the members to be
	            // stringified.
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    k = rep[i];
	                    if (typeof k === 'string') {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	            else {
	                // Otherwise, iterate through all of the keys in the object.
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	            
	        // Join all of the member texts together, separated with commas,
	        // and wrap them in braces.
	
	        v = partial.length === 0 ? '{}' : gap ?
	            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	            '{' + partial.join(',') + '}';
	        gap = mind;
	        return v;
	    }
	}
	
	module.exports = function (value, replacer, space) {
	    var i;
	    gap = '';
	    indent = '';
	    
	    // If the space parameter is a number, make an indent string containing that
	    // many spaces.
	    if (typeof space === 'number') {
	        for (i = 0; i < space; i += 1) {
	            indent += ' ';
	        }
	    }
	    // If the space parameter is a string, it will be used as the indent string.
	    else if (typeof space === 'string') {
	        indent = space;
	    }
	
	    // If there is a replacer, it must be a function or an array.
	    // Otherwise, throw an error.
	    rep = replacer;
	    if (replacer && typeof replacer !== 'function'
	    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
	        throw new Error('JSON.stringify');
	    }
	    
	    // Make a fake root object containing our value under the key of ''.
	    // Return the result of stringifying the value.
	    return str('', {'': value});
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function (xs, f) {
	    if (xs.map) return xs.map(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        var x = xs[i];
	        if (hasOwn.call(xs, i)) res.push(f(x, i, xs));
	    }
	    return res;
	};
	
	var hasOwn = Object.prototype.hasOwnProperty;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * Array#filter.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @return {Array}
	 */
	
	module.exports = function (arr, fn) {
	  if (arr.filter) return arr.filter(fn);
	  var ret = [];
	  for (var i = 0; i < arr.length; i++) {
	    if (!hasOwn.call(arr, i)) continue;
	    if (fn(arr[i], i, arr)) ret.push(arr[i]);
	  }
	  return ret;
	};
	
	var hasOwn = Object.prototype.hasOwnProperty;


/***/ },
/* 20 */
/***/ function(module, exports) {

	var hasOwn = Object.prototype.hasOwnProperty;
	
	module.exports = function (xs, f, acc) {
	    var hasAcc = arguments.length >= 3;
	    if (hasAcc && xs.reduce) return xs.reduce(f, acc);
	    if (xs.reduce) return xs.reduce(f);
	    
	    for (var i = 0; i < xs.length; i++) {
	        if (!hasOwn.call(xs, i)) continue;
	        if (!hasAcc) {
	            acc = xs[i];
	            hasAcc = true;
	            continue;
	        }
	        acc = f(acc, xs[i], i);
	    }
	    return acc;
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=quark.bundle.js.map