import { DataMatrixReader } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader';

class BrowserDatamatrixCodeReader extends BrowserCodeReader {
  /**
   * Creates an instance of BrowserQRCodeReader.
   */
  constructor(hints, options) {
    super(new DataMatrixReader(), hints, options);
  }
}

export { BrowserDatamatrixCodeReader };
//# sourceMappingURL=BrowserDatamatrixCodeReader.js.map
//# sourceMappingURL=BrowserDatamatrixCodeReader.js.map