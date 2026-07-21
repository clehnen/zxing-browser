'use strict';

var library = require('@zxing/library');
var BrowserCodeReader = require('./BrowserCodeReader');

class BrowserDatamatrixCodeReader extends BrowserCodeReader.BrowserCodeReader {
  /**
   * Creates an instance of BrowserQRCodeReader.
   */
  constructor(hints, options) {
    super(new library.DataMatrixReader(), hints, options);
  }
}

exports.BrowserDatamatrixCodeReader = BrowserDatamatrixCodeReader;
//# sourceMappingURL=BrowserDatamatrixCodeReader.cjs.map
//# sourceMappingURL=BrowserDatamatrixCodeReader.cjs.map