'use strict';

var library = require('@zxing/library');
var BrowserCodeReader = require('./BrowserCodeReader');

class BrowserMultiFormatReader extends BrowserCodeReader.BrowserCodeReader {
  set possibleFormats(formats) {
    this.hints.set(library.DecodeHintType.POSSIBLE_FORMATS, formats);
    this.reader.setHints(this.hints);
  }
  constructor(hints, options) {
    const reader = new library.MultiFormatReader();
    reader.setHints(hints);
    super(reader, hints, options);
    this.reader = reader;
  }
  /**
   * Overwrite decodeBitmap to call decodeWithState, which will pay
   * attention to the hints set in the constructor function
   */
  decodeBitmap(binaryBitmap) {
    return this.reader.decodeWithState(binaryBitmap);
  }
  /**
   * Allows to change hints in runtime.
   */
  setHints(hints) {
    this.hints = hints;
    this.reader.setHints(this.hints);
  }
}

exports.BrowserMultiFormatReader = BrowserMultiFormatReader;
//# sourceMappingURL=BrowserMultiFormatReader.cjs.map
//# sourceMappingURL=BrowserMultiFormatReader.cjs.map