import { DecodeHintType } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.cjs';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.cjs';
import '../common/DecodeContinuouslyCallback.cjs';
import '../common/IScannerControls.cjs';
import '../common/HTMLVisualMediaElement.cjs';

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
