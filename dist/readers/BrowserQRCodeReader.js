import { QRCodeReader } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader';

class BrowserQRCodeReader extends BrowserCodeReader {
  /**
   * Creates an instance of BrowserQRCodeReader.
   */
  constructor(hints, options) {
    super(new QRCodeReader(), hints, options);
  }
}

export { BrowserQRCodeReader };
//# sourceMappingURL=BrowserQRCodeReader.js.map
//# sourceMappingURL=BrowserQRCodeReader.js.map