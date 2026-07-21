import { DecodeHintType } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.cjs';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.cjs';
import '../common/DecodeContinuouslyCallback.cjs';
import '../common/IScannerControls.cjs';
import '../common/HTMLVisualMediaElement.cjs';

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
