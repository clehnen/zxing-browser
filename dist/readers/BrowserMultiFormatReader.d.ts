import { BarcodeFormat, MultiFormatReader, DecodeHintType, BinaryBitmap, Result } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.js';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.js';
import '../common/DecodeContinuouslyCallback.js';
import '../common/IScannerControls.js';
import '../common/HTMLVisualMediaElement.js';

declare class BrowserMultiFormatReader extends BrowserCodeReader {
    set possibleFormats(formats: BarcodeFormat[]);
    protected readonly reader: MultiFormatReader;
    constructor(hints?: Map<DecodeHintType, any>, options?: IBrowserCodeReaderOptions);
    /**
     * Overwrite decodeBitmap to call decodeWithState, which will pay
     * attention to the hints set in the constructor function
     */
    decodeBitmap(binaryBitmap: BinaryBitmap): Result;
    /**
     * Allows to change hints in runtime.
     */
    setHints(hints: Map<DecodeHintType, any>): void;
}

export { BrowserMultiFormatReader };
