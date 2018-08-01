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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

const codeBlockDefaultReg = /^{{(.*?)}}/g,
      blockFixBeginDefaultReg = /^(\\{{)/g,
      blockFixDefaultReg = /\\({{)/g,
      nameReg = /^([a-zA-Z$_][a-zA-Z$_.]*)/,
      strReg = /^(?:('.*')|(".*"))/,
      skipReg = /^(?:(?:\/\*.*\*\/)|(?:\/\/.*(?:\r\n)|\r|\n)|(?:[\x20\t\r\n\f]+))/;
const createCodeStr = function (str) {
  let code = str,
      backStr = '',
      match;
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
const parseStr = function (blockFixBeginReg, codeBlockReg, context, str) {
  let code = str,
      backStr = '',
      match,
      rep = false;
  while (code.length > 0) {
    match = blockFixBeginReg.exec(code);
    if (match) {
      backStr += match[1];
      code = code.slice(match[0].length);
    } else {
      match = codeBlockReg.exec(code);
      if (match) {
        let cd = match[1];
        if (cd) cd = createCodeStr(cd);
        if (cd) {
          backStr += codeFun(context, cd);
          rep = true;
        }
        code = code.slice(match[0].length);
      } else {
        backStr += code[0];
        code = code.slice(1);
      }
    }
  }
  return { str: backStr, rep };
};
const toString = function (obj) {
  if (obj === null) return 'null';
  if (obj === void 0) return 'undefined';
  return obj.toString();
};
const codeFun = function (context, code) {
  const funCode = 'var codeStr = ' + code + '; return toString(codeStr);';
  const fun = new Function('toString', 'context', funCode);
  return fun(toString, context);
};
const parse = function (context, str, option = {}) {
  if (!str) return '';
  const { delimiters, deep = true } = option;
  let codeBlockReg, blockFixReg, blockFixBeginReg;
  if (delimiters === void 0) {
    codeBlockReg = codeBlockDefaultReg;
    blockFixReg = blockFixDefaultReg;
    blockFixBeginReg = blockFixBeginDefaultReg;
  } else {
    if (!Array.isArray(delimiters) || delimiters.length < 1 || delimiters[0].length < 1) throw new TypeError('delimiters error');
    let codeRegStr = '^' + delimiters[0] + '(.*?)';
    if (delimiters[1]) codeRegStr += delimiters[1];
    codeBlockReg = new RegExp(codeRegStr, 'g');
    blockFixBeginReg = new RegExp('^(\\\\' + delimiters[0] + ')');
    blockFixReg = new RegExp('\\\\(' + delimiters[0] + ')', 'g');
  }
  let bk;
  do {
    bk = parseStr(blockFixBeginReg, codeBlockReg, context, str);
    str = bk.str;
  } while (deep && bk.rep);
  if (str) str = str.replace(blockFixReg, '$1');
  return str;
};
module.exports = parse;

/***/ })

/******/ });
});