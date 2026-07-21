function hasNavigator() {
  return typeof navigator !== "undefined";
}
function isMediaDevicesSupported() {
  return hasNavigator() && !!navigator.mediaDevices;
}
function canEnumerateDevices() {
  return !!(isMediaDevicesSupported() && navigator.mediaDevices.enumerateDevices);
}

export { canEnumerateDevices, hasNavigator };
//# sourceMappingURL=navigator-utils.js.map
//# sourceMappingURL=navigator-utils.js.map