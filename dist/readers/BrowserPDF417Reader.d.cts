import { DecodeHintType } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.cjs';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.cjs';
import '../common/DecodeContinuouslyCallback.cjs';
import '../common/IScannerControls.cjs';
import '../common/HTMLVisualMediaElement.cjs';

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
