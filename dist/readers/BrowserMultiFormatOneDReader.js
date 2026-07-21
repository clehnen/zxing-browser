import { MultiFormatOneDReader } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader';

class BrowserMultiFormatOneDReader extends BrowserCodeReader {
  /**
   * Creates an instance of BrowserBarcodeReader.
   * @param {Map<DecodeHintType, any>} hints?
   * @param options
   */
  constructor(hints, options) {
    super(new MultiFormatOneDReader(hints), hints, options);
  }
}

export { BrowserMultiFormatOneDReader };
//# sourceMappingURL=BrowserMultiFormatOneDReader.js.map
//# sourceMappingURL=BrowserMultiFormatOneDReader.js.map