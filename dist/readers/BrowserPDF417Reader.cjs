'use strict';

var library = require('@zxing/library');
var BrowserCodeReader = require('./BrowserCodeReader');

class BrowserPDF417Reader extends BrowserCodeReader.BrowserCodeReader {
  /**
   * Creates an instance of BrowserPDF417Reader.
   */
  constructor(hints, options) {
    super(new library.PDF417Reader(), hints, options);
  }
}

exports.BrowserPDF417Reader = BrowserPDF417Reader;
//# sourceMappingURL=BrowserPDF417Reader.cjs.map
//# sourceMappingURL=BrowserPDF417Reader.cjs.map