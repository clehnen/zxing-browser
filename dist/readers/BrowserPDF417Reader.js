import { PDF417Reader } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader';

class BrowserPDF417Reader extends BrowserCodeReader {
  /**
   * Creates an instance of BrowserPDF417Reader.
   */
  constructor(hints, options) {
    super(new PDF417Reader(), hints, options);
  }
}

export { BrowserPDF417Reader };
//# sourceMappingURL=BrowserPDF417Reader.js.map
//# sourceMappingURL=BrowserPDF417Reader.js.map