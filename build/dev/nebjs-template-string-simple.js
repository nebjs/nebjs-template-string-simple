(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/Context.js":
/*!*****************************!*\
  !*** ./src/core/Context.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var codeBlockDefaultReg = /^{{(.*?)}}/g,
    blockFixBeginDefaultReg = /^(\\{{)/g,
    blockFixDefaultReg = /\\({{)/g;

/**
 * 分析器环境类
 */

var Context = function Context() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Context);

  var delimiters = option.delimiters,
      _option$deep = option.deep,
      deep = _option$deep === undefined ? true : _option$deep;

  var codeBlockReg = void 0,
      blockFixReg = void 0,
      blockFixBeginReg = void 0;
  if (delimiters === void 0) {
    codeBlockReg = codeBlockDefaultReg;
    blockFixReg = blockFixDefaultReg;
    blockFixBeginReg = blockFixBeginDefaultReg;
  } else {
    if (!Array.isArray(delimiters) || delimiters.length < 1 || delimiters[0].length < 1) throw new TypeError('delimiters error');
    var codeRegStr = '^' + delimiters[0] + '(.*?)';
    if (delimiters[1]) codeRegStr += delimiters[1];
    codeBlockReg = new RegExp(codeRegStr, 'g');
    blockFixBeginReg = new RegExp('^(\\\\' + delimiters[0] + ')');
    blockFixReg = new RegExp('\\\\(' + delimiters[0] + ')', 'g');
  }
  this.regExp = {
    nameReg: /^([a-zA-Z$_][a-zA-Z$_.]*)/,
    strReg: /^(?:('.*')|(".*"))/,
    skipReg: /^(?:(?:\/\*.*\*\/)|(?:\/\/.*(?:\r\n)|\r|\n)|(?:[\x20\t\r\n\f]+))/,
    codeBlockReg: codeBlockReg, blockFixReg: blockFixReg, blockFixBeginReg: blockFixBeginReg
  };
  this.deepMode = deep;
};

module.exports = Context;

/***/ }),

/***/ "./src/core/Parser.js":
/*!****************************!*\
  !*** ./src/core/Parser.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = __webpack_require__(/*! ./Context */ "./src/core/Context.js");
var createCodeStr = function createCodeStr(context, str) {
  var _context$regExp = context.regExp,
      strReg = _context$regExp.strReg,
      skipReg = _context$regExp.skipReg,
      nameReg = _context$regExp.nameReg;

  var code = str,
      backStr = '',
      match = void 0;
  while (code.length > 0) {
    match = strReg.exec(code);
    if (match) {
      backStr += match[1] || match[2];
      code = code.slice(match[0].length);
    } else {
      match = skipReg.exec(code);
      if (match) {
        code = code.slice(match[0].length);
      } else {
        match = nameReg.exec(code);
        if (match) {
          backStr += 'context.' + match[1];
          code = code.slice(match[0].length);
        } else {
          backStr += code[0];
          code = code.slice(1);
        }
      }
    }
  }
  return backStr;
};
var parseStr = function parseStr(context, bind, str) {
  var code = str,
      backStr = '',
      match = void 0,
      rep = false;
  var regExp = context.regExp,
      errors = context.errors,
      blockFixBeginReg = regExp.blockFixBeginReg,
      codeBlockReg = regExp.codeBlockReg;

  while (code.length > 0) {
    match = blockFixBeginReg.exec(code);
    if (match) {
      backStr += match[1];
      code = code.slice(match[0].length);
    } else {
      match = codeBlockReg.exec(code);
      if (match) {
        var cd = match[1];
        if (cd) cd = createCodeStr(context, cd);
        if (cd) {
          try {
            backStr += codeFun(bind, cd);
            rep = true;
          } catch (e) {
            errors.push(e);
          }
        }
        code = code.slice(match[0].length);
      } else {
        backStr += code[0];
        code = code.slice(1);
      }
    }
  }
  return { str: backStr, rep: rep };
};
var toString = function toString(obj) {
  if (obj === null) return 'null';
  if (obj === void 0) return 'undefined';
  return obj.toString();
};
var codeFun = function codeFun(bind, code) {
  var funCode = 'var codeStr = ' + code + '; return toString(codeStr);';
  var fun = new Function('toString', 'context', funCode);
  return fun(toString, bind);
};

/**
 * 转换器类
 */

var Parser = function () {
  /**
   * @param bind {Object} 绑定
   * @param context {Context} 环境
   */
  function Parser(bind, context) {
    _classCallCheck(this, Parser);

    if (!(bind && bind instanceof Object)) throw new TypeError('bind must be a Object');
    if (context !== void 0) {
      if (!(context instanceof Context)) throw new TypeError('context must be a Context object');
      this.context = context;
    } else {
      this.context = new Context();
    }
    this.bind = bind;
    this.errors = [];
    this.string = '';
    this.parserString = '';
  }

  /**
   * 获取词法表
   * @param str
   * @return {String}
   */


  _createClass(Parser, [{
    key: 'parse',
    value: function parse(str) {
      this.errors = [];
      this.string = str = str.slice(0);
      this.parserString = str;
      if (!str) return '';
      var parseBack = void 0;
      var context = this.context,
          bind = this.bind,
          regExp = context.regExp,
          deepMode = context.deepMode,
          blockFixReg = regExp.blockFixReg;

      do {
        parseBack = parseStr(context, bind, str);
        str = parseBack.str;
      } while (deepMode && parseBack.rep);
      if (str) str = str.replace(blockFixReg, '$1');
      return this.parserString = str;
    }
  }]);

  return Parser;
}();

module.exports = Parser;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Context = __webpack_require__(/*! ./core/Context */ "./src/core/Context.js");
var Parser = __webpack_require__(/*! ./core/Parser */ "./src/core/Parser.js");
module.exports = { Context: Context, Parser: Parser };

/***/ })

/******/ });
});