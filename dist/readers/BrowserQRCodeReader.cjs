'use strict';

var library = require('@zxing/library');
var BrowserCodeReader = require('./BrowserCodeReader');

class BrowserQRCodeReader extends BrowserCodeReader.BrowserCodeReader {
  /**
   * Creates an instance of BrowserQRCodeReader.
   */
  constructor(hints, options) {
    super(new library.QRCodeReader(), hints, options);
  }
}

exports.BrowserQRCodeReader = BrowserQRCodeReader;
//# sourceMappingURL=BrowserQRCodeReader.cjs.map
//# sourceMappingURL=BrowserQRCodeReader.cjs.map