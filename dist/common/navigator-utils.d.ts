/**
 * If navigator is present.
 */
declare function hasNavigator(): boolean;
/**
 * If enumerateDevices under navigator is supported.
 */
declare function canEnumerateDevices(): boolean;

export { canEnumerateDevices, hasNavigator };
