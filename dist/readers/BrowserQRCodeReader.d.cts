import { DecodeHintType } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.cjs';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.cjs';
import '../common/DecodeContinuouslyCallback.cjs';
import '../common/IScannerControls.cjs';
import '../common/HTMLVisualMediaElement.cjs';

/**
 * QR Code reader to use from browser.
 */
declare class BrowserQRCodeReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserQRCodeReader.
     */
    constructor(hints?: Map<DecodeHintType, any>, options?: IBrowserCodeReaderOptions);
}

export { BrowserQRCodeReader };
