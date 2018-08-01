const Context = require('./Context');
const createCodeStr = function (context, str) {
  const {strReg, skipReg, nameReg} = context.regExp;
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
const parseStr = function (context, bind, str) {
  let code = str, backStr = '', match, rep = false;
  const {regExp, errors} = context, {blockFixBeginReg, codeBlockReg} = regExp;
  while (code.length > 0) {
    match = blockFixBeginReg.exec(code);
    if (match) {
      backStr += match[1];
      code = code.slice(match[0].length);
    } else {
      match = codeBlockReg.exec(code);
      if (match) {
        let cd = match[1];
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
  return {str: backStr, rep};
};
const toString = function (obj) {
  if (obj === null) return 'null';
  if (obj === void 0) return 'undefined';
  return obj.toString();
};
const codeFun = function (bind, code) {
  const funCode = 'var codeStr = ' + code + '; return toString(codeStr);';
  const fun = new Function('toString', 'context', funCode);
  return fun(toString, bind);
};

/**
 * 转换器类
 */
class Parser {
  /**
   * @param bind {Object} 绑定
   * @param context {Context} 环境
   */
  constructor(bind, context) {
    if (!(bind && bind instanceof Object)) throw new TypeError('bind must be a Object');
    if (context !== void 0) {
      if (!(context instanceof Context)) throw new TypeError('context must be a Context object');
      this.context = context;
    } else {
      this.context = new Context()
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
  parse(str) {
    this.errors = [];
    this.string = str = str.slice(0);
    this.parserString = str;
    if (!str) return '';
    let parseBack;
    const {context, bind} = this, {regExp, deepMode} = context, {blockFixReg} = regExp;
    do {
      parseBack = parseStr(context, bind, str);
      str = parseBack.str;
    } while (deepMode && parseBack.rep);
    if (str) str = str.replace(blockFixReg, '$1');
    return this.parserString = str;
  }
}

module.exports = Parser;
