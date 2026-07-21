'use strict';

var library = require('@zxing/library');

const svgNs = "http://www.w3.org/2000/svg";
class BrowserQRCodeSvgWriter {
  static QUIET_ZONE_SIZE = 4;
  /**
   * Writes and renders a QRCode SVG element.
   *
   * @param contents
   * @param width
   * @param height
   * @param hints
   */
  write(contents, width, height, hints) {
    if (contents.length === 0) {
      throw new library.IllegalArgumentException("Found empty contents");
    }
    if (width < 0 || height < 0) {
      throw new library.IllegalArgumentException("Requested dimensions are too small: " + width + "x" + height);
    }
    let errorCorrectionLevel = library.QRCodeDecoderErrorCorrectionLevel.L;
    let quietZone = BrowserQRCodeSvgWriter.QUIET_ZONE_SIZE;
    if (hints) {
      if (void 0 !== hints.get(library.EncodeHintType.ERROR_CORRECTION)) {
        const correctionStr = hints.get(library.EncodeHintType.ERROR_CORRECTION).toString();
        errorCorrectionLevel = library.QRCodeDecoderErrorCorrectionLevel.fromString(correctionStr);
      }
      if (void 0 !== hints.get(library.EncodeHintType.MARGIN)) {
        quietZone = Number.parseInt(hints.get(library.EncodeHintType.MARGIN).toString(), 10);
      }
    }
    const code = library.QRCodeEncoder.encode(contents, errorCorrectionLevel, hints);
    return this.renderResult(code, width, height, quietZone);
  }
  /**
   * Renders the result and then appends it to the DOM.
   */
  writeToDom(containerElement, contents, width, height, hints) {
    if (typeof containerElement === "string") {
      const targetEl = document.querySelector(containerElement);
      if (!targetEl) {
        throw new Error("Could no find the target HTML element.");
      }
      containerElement = targetEl;
    }
    const svgElement = this.write(contents, width, height, hints);
    if (containerElement instanceof HTMLElement) {
      containerElement.appendChild(svgElement);
    }
  }
  /**
   * Note that the input matrix uses 0 == white, 1 == black.
   * The output matrix uses 0 == black, 255 == white (i.e. an 8 bit greyscale bitmap).
   */
  renderResult(code, width, height, quietZone) {
    const input = code.getMatrix();
    if (input === null) {
      throw new library.IllegalStateException();
    }
    const inputWidth = input.getWidth();
    const inputHeight = input.getHeight();
    const qrWidth = inputWidth + quietZone * 2;
    const qrHeight = inputHeight + quietZone * 2;
    const outputWidth = Math.max(width, qrWidth);
    const outputHeight = Math.max(height, qrHeight);
    const multiple = Math.min(Math.floor(outputWidth / qrWidth), Math.floor(outputHeight / qrHeight));
    const leftPadding = Math.floor((outputWidth - inputWidth * multiple) / 2);
    const topPadding = Math.floor((outputHeight - inputHeight * multiple) / 2);
    const svgElement = this.createSVGElement(outputWidth, outputHeight);
    for (let inputY = 0, outputY = topPadding; inputY < inputHeight; inputY++, outputY += multiple) {
      for (let inputX = 0, outputX = leftPadding; inputX < inputWidth; inputX++, outputX += multiple) {
        if (input.get(inputX, inputY) === 1) {
          const svgRectElement = this.createSvgRectElement(outputX, outputY, multiple, multiple);
          svgElement.appendChild(svgRectElement);
        }
      }
    }
    return svgElement;
  }
  /**
   * Creates a SVG element.
   *
   * @param w SVG's width attribute
   * @param h SVG's height attribute
   */
  createSVGElement(w, h) {
    const svgElement = document.createElementNS(svgNs, "svg");
    const width = w.toString();
    const height = h.toString();
    svgElement.setAttribute("height", height);
    svgElement.setAttribute("width", width);
    svgElement.setAttribute("viewBox", "0 0 " + width + " " + height);
    return svgElement;
  }
  /**
   * Creates a SVG rect element.
   *
   * @param x Element's x coordinate
   * @param y Element's y coordinate
   * @param w Element's width attribute
   * @param h Element's height attribute
   */
  createSvgRectElement(x, y, w, h) {
    const rect = document.createElementNS(svgNs, "rect");
    rect.setAttribute("x", x.toString());
    rect.setAttribute("y", y.toString());
    rect.setAttribute("height", w.toString());
    rect.setAttribute("width", h.toString());
    rect.setAttribute("fill", "#000000");
    return rect;
  }
}

exports.BrowserQRCodeSvgWriter = BrowserQRCodeSvgWriter;
//# sourceMappingURL=BrowserQRCodeSvgWriter.cjs.map
//# sourceMappingURL=BrowserQRCodeSvgWriter.cjs.map