'use strict';

var library = require('@zxing/library');
var BrowserCodeReader = require('./BrowserCodeReader');

class BrowserMultiFormatOneDReader extends BrowserCodeReader.BrowserCodeReader {
  /**
   * Creates an instance of BrowserBarcodeReader.
   * @param {Map<DecodeHintType, any>} hints?
   * @param options
   */
  constructor(hints, options) {
    super(new library.MultiFormatOneDReader(hints), hints, options);
  }
}

exports.BrowserMultiFormatOneDReader = BrowserMultiFormatOneDReader;
//# sourceMappingURL=BrowserMultiFormatOneDReader.cjs.map
//# sourceMappingURL=BrowserMultiFormatOneDReader.cjs.map