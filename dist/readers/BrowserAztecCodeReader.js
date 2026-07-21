import { AztecCodeReader } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader';

class BrowserAztecCodeReader extends BrowserCodeReader {
  /**
   * Creates an instance of BrowserAztecCodeReader.
   */
  constructor(hints, options) {
    super(new AztecCodeReader(), hints, options);
  }
}

export { BrowserAztecCodeReader };
//# sourceMappingURL=BrowserAztecCodeReader.js.map
//# sourceMappingURL=BrowserAztecCodeReader.js.map