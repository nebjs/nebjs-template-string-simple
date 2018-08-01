const codeBlockDefaultReg = /^{{(.*?)}}/g,
  blockFixBeginDefaultReg = /^(\\{{)/g,
  blockFixDefaultReg = /\\({{)/g;

/**
 * 分析器环境类
 */
class Context {
  constructor(option = {}) {
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
    this.regExp = {
      nameReg: /^([a-zA-Z$_][a-zA-Z$_.]*)/,
      strReg: /^(?:('.*')|(".*"))/,
      skipReg: /^(?:(?:\/\*.*\*\/)|(?:\/\/.*(?:\r\n)|\r|\n)|(?:[\x20\t\r\n\f]+))/,
      codeBlockReg, blockFixReg, blockFixBeginReg
    };
    this.deepMode = deep;
  }

}

module.exports = Context;
