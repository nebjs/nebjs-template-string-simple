const codeBlockDefaultReg = /^{{(.*?)}}/g,
  blockFixBeginDefaultReg = /^(\\{{)/g,
  blockFixDefaultReg = /\\({{)/g,
  nameReg = /^([a-zA-Z$_][a-zA-Z$_.]*)/,
  strReg = /^(?:('.*')|(".*"))/,
  skipReg = /^(?:(?:\/\*.*\*\/)|(?:\/\/.*(?:\r\n)|\r|\n)|(?:[\x20\t\r\n\f]+))/;
const createCodeStr = function (str) {
  let code = str, backStr = '', match;
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
  let code = str, backStr = '', match, rep = false;
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
  return {str: backStr, rep};
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
  const {delimiters, deep = true} = option;
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
