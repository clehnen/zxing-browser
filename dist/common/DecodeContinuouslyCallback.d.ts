import { Result, Exception } from '@zxing/library';
import { IScannerControls } from './IScannerControls.js';

/**
 * Callback format for continuous decode scan.
 */
type DecodeContinuouslyCallback = (result: Result | undefined, error: Exception | undefined, controls: IScannerControls) => void;

export type { DecodeContinuouslyCallback };
