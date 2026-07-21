import { BarcodeFormat, MultiFormatReader, DecodeHintType, BinaryBitmap, Result } from '@zxing/library';
import { BrowserCodeReader } from './BrowserCodeReader.cjs';
import { IBrowserCodeReaderOptions } from './IBrowserCodeReaderOptions.cjs';
import '../common/DecodeContinuouslyCallback.cjs';
import '../common/IScannerControls.cjs';
import '../common/HTMLVisualMediaElement.cjs';

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
