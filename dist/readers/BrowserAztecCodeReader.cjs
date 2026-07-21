'use strict';

var library = require('@zxing/library');
var BrowserCodeReader = require('./BrowserCodeReader');

class BrowserAztecCodeReader extends BrowserCodeReader.BrowserCodeReader {
  /**
   * Creates an instance of BrowserAztecCodeReader.
   */
  constructor(hints, options) {
    super(new library.AztecCodeReader(), hints, options);
  }
}

exports.BrowserAztecCodeReader = BrowserAztecCodeReader;
//# sourceMappingURL=BrowserAztecCodeReader.cjs.map
//# sourceMappingURL=BrowserAztecCodeReader.cjs.map