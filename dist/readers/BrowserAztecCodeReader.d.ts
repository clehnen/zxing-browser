import { DecodeHintType } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.js';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.js';
import '../common/DecodeContinuouslyCallback.js';
import '../common/IScannerControls.js';
import '../common/HTMLVisualMediaElement.js';

/**
 * Aztec Code reader to use from browser.
 *
 * @class BrowserAztecCodeReader
 * @extends {BrowserCodeReader}
 */
declare class BrowserAztecCodeReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserAztecCodeReader.
     */
    constructor(hints?: Map<DecodeHintType, any>, options?: IBrowserCodeReaderOptions);
}

export { BrowserAztecCodeReader };
