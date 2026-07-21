'use strict';

function hasNavigator() {
  return typeof navigator !== "undefined";
}
function isMediaDevicesSupported() {
  return hasNavigator() && !!navigator.mediaDevices;
}
function canEnumerateDevices() {
  return !!(isMediaDevicesSupported() && navigator.mediaDevices.enumerateDevices);
}

exports.canEnumerateDevices = canEnumerateDevices;
exports.hasNavigator = hasNavigator;
//# sourceMappingURL=navigator-utils.cjs.map
//# sourceMappingURL=navigator-utils.cjs.map