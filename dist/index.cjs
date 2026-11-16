'use strict';

var library = require('@zxing/library');
var HTMLCanvasElementLuminanceSource = require('./common/HTMLCanvasElementLuminanceSource');
var BrowserAztecCodeReader = require('./readers/BrowserAztecCodeReader');
var BrowserMultiFormatOneDReader = require('./readers/BrowserMultiFormatOneDReader');
var BrowserCodeReader = require('./readers/BrowserCodeReader');
var BrowserDatamatrixCodeReader = require('./readers/BrowserDatamatrixCodeReader');
var BrowserMultiFormatReader = require('./readers/BrowserMultiFormatReader');
var BrowserPDF417Reader = require('./readers/BrowserPDF417Reader');
var BrowserQRCodeReader = require('./readers/BrowserQRCodeReader');
var BrowserCodeSvgWriter = require('./writers/BrowserCodeSvgWriter');
var BrowserQRCodeSvgWriter = require('./writers/BrowserQRCodeSvgWriter');



Object.defineProperty(exports, "BarcodeFormat", {
  enumerable: true,
  get: function () { return library.BarcodeFormat; }
});
Object.defineProperty(exports, "HTMLCanvasElementLuminanceSource", {
  enumerable: true,
  get: function () { return HTMLCanvasElementLuminanceSource.HTMLCanvasElementLuminanceSource; }
});
Object.defineProperty(exports, "BrowserAztecCodeReader", {
  enumerable: true,
  get: function () { return BrowserAztecCodeReader.BrowserAztecCodeReader; }
});
Object.defineProperty(exports, "BrowserMultiFormatOneDReader", {
  enumerable: true,
  get: function () { return BrowserMultiFormatOneDReader.BrowserMultiFormatOneDReader; }
});
Object.defineProperty(exports, "BrowserCodeReader", {
  enumerable: true,
  get: function () { return BrowserCodeReader.BrowserCodeReader; }
});
Object.defineProperty(exports, "BrowserDatamatrixCodeReader", {
  enumerable: true,
  get: function () { return BrowserDatamatrixCodeReader.BrowserDatamatrixCodeReader; }
});
Object.defineProperty(exports, "BrowserMultiFormatReader", {
  enumerable: true,
  get: function () { return BrowserMultiFormatReader.BrowserMultiFormatReader; }
});
Object.defineProperty(exports, "BrowserPDF417Reader", {
  enumerable: true,
  get: function () { return BrowserPDF417Reader.BrowserPDF417Reader; }
});
Object.defineProperty(exports, "BrowserQRCodeReader", {
  enumerable: true,
  get: function () { return BrowserQRCodeReader.BrowserQRCodeReader; }
});
Object.defineProperty(exports, "BrowserCodeSvgWriter", {
  enumerable: true,
  get: function () { return BrowserCodeSvgWriter.BrowserCodeSvgWriter; }
});
Object.defineProperty(exports, "BrowserQRCodeSvgWriter", {
  enumerable: true,
  get: function () { return BrowserQRCodeSvgWriter.BrowserQRCodeSvgWriter; }
});
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map