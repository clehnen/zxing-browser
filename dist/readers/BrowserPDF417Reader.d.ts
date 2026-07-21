import { DecodeHintType } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.js';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.js';
import '../common/DecodeContinuouslyCallback.js';
import '../common/IScannerControls.js';
import '../common/HTMLVisualMediaElement.js';

/**
 * QR Code reader to use from browser.
 */
declare class BrowserPDF417Reader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserPDF417Reader.
     */
    constructor(hints?: Map<DecodeHintType, any>, options?: IBrowserCodeReaderOptions);
}

export { BrowserPDF417Reader };
