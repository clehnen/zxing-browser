import { DecodeHintType } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.js';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.js';
import '../common/DecodeContinuouslyCallback.js';
import '../common/IScannerControls.js';
import '../common/HTMLVisualMediaElement.js';

/**
 * Reader to be used for any One Dimension type barcode.
 */
declare class BrowserMultiFormatOneDReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserBarcodeReader.
     * @param {Map<DecodeHintType, any>} hints?
     * @param options
     */
    constructor(hints?: Map<DecodeHintType, any>, options?: IBrowserCodeReaderOptions);
}

export { BrowserMultiFormatOneDReader };
