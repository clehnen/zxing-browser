'use strict';

var library = require('@zxing/library');
var HTMLCanvasElementLuminanceSource = require('../common/HTMLCanvasElementLuminanceSource');
var navigatorUtils = require('../common/navigator-utils');

const defaultOptions = {
  delayBetweenScanAttempts: 500,
  delayBetweenScanSuccess: 500,
  tryPlayVideoTimeout: 5e3
};
class BrowserCodeReader {
  /**
   * Creates an instance of BrowserCodeReader.
   * @param {Reader} reader The reader instance to decode the barcode
   * @param hints Holds the hints the user sets for the Reader.
   */
  constructor(reader, hints = /* @__PURE__ */ new Map(), options = {}) {
    this.reader = reader;
    this.hints = hints;
    this.options = { ...defaultOptions, ...options };
  }
  reader;
  hints;
  /**
   * Allows to change the possible formats the decoder should
   * search for while scanning some image. Useful for changing
   * the possible formats during BrowserCodeReader::scan.
   */
  set possibleFormats(formats) {
    this.hints.set(library.DecodeHintType.POSSIBLE_FORMATS, formats);
  }
  /**
   * Defines what the videoElement src will be.
   *
   * @param videoElement
   * @param stream The stream to be added as a source.
   */
  static addVideoSource(videoElement, stream) {
    try {
      videoElement.srcObject = stream;
    } catch (err) {
      console.error("got interrupted by new loading request");
    }
  }
  /**
   * Enables or disables the torch in a media stream.
   *
   * @experimental This doesn't work across all browsers and is still a Draft.
   */
  static async mediaStreamSetTorch(track, onOff) {
    await track.applyConstraints({
      advanced: [{
        fillLightMode: onOff ? "flash" : "off",
        torch: onOff
      }]
    });
  }
  /**
   * Checks if the stream has torch support.
   */
  static mediaStreamIsTorchCompatible(params) {
    const tracks = params.getVideoTracks();
    for (const track of tracks) {
      if (BrowserCodeReader.mediaStreamIsTorchCompatibleTrack(track)) {
        return true;
      }
    }
    return false;
  }
  /**
   *
   * @param track The media stream track that will be checked for compatibility.
   */
  static mediaStreamIsTorchCompatibleTrack(track) {
    try {
      const capabilities = track.getCapabilities();
      return "torch" in capabilities;
    } catch (err) {
      console.error(err);
      console.warn("Your browser may be not fully compatible with WebRTC and/or ImageCapture specs. Torch will not be available.");
      return false;
    }
  }
  /**
   * Checks if the given video element is currently playing.
   */
  static isVideoPlaying(video) {
    return video.currentTime > 0 && !video.paused && video.readyState > 2;
  }
  /**
   * Searches and validates a media element.
   */
  static getMediaElement(mediaElementId, type) {
    const mediaElement = document.getElementById(mediaElementId);
    if (!mediaElement) {
      throw new library.ArgumentException(`element with id '${mediaElementId}' not found`);
    }
    if (mediaElement.nodeName.toLowerCase() !== type.toLowerCase()) {
      throw new library.ArgumentException(`element with id '${mediaElementId}' must be an ${type} element`);
    }
    return mediaElement;
  }
  /**
   * Receives a source and makes sure to return a Video Element from it or fail.
   */
  static createVideoElement(videoThingy) {
    if (videoThingy instanceof HTMLVideoElement) {
      return videoThingy;
    }
    if (typeof videoThingy === "string") {
      return BrowserCodeReader.getMediaElement(videoThingy, "video");
    }
    if (!videoThingy && typeof document !== "undefined") {
      const videoElement = document.createElement("video");
      videoElement.width = 200;
      videoElement.height = 200;
      return videoElement;
    }
    throw new Error("Couldn't get videoElement from videoSource!");
  }
  /**
   * Receives a source and makes sure to return an Image Element from it or fail.
   */
  static prepareImageElement(imageSource) {
    if (imageSource instanceof HTMLImageElement) {
      return imageSource;
    }
    if (typeof imageSource === "string") {
      return BrowserCodeReader.getMediaElement(imageSource, "img");
    }
    if (typeof imageSource === "undefined") {
      const imageElement = document.createElement("img");
      imageElement.width = 200;
      imageElement.height = 200;
      return imageElement;
    }
    throw new Error("Couldn't get imageElement from imageSource!");
  }
  /**
   * Sets a HTMLVideoElement for scanning or creates a new one.
   *
   * @param videoElem The HTMLVideoElement to be set.
   */
  static prepareVideoElement(videoElem) {
    const videoElement = BrowserCodeReader.createVideoElement(videoElem);
    videoElement.setAttribute("autoplay", "true");
    videoElement.setAttribute("muted", "true");
    videoElement.setAttribute("playsinline", "true");
    return videoElement;
  }
  /**
   * Checks if and HTML image is loaded.
   */
  static isImageLoaded(img) {
    if (!img.complete) {
      return false;
    }
    if (img.naturalWidth === 0) {
      return false;
    }
    return true;
  }
  /**
   * Creates a binaryBitmap based in a canvas.
   *
   * @param canvas HTML canvas element containing the image source draw.
   */
  static createBinaryBitmapFromCanvas(canvas) {
    const luminanceSource = new HTMLCanvasElementLuminanceSource.HTMLCanvasElementLuminanceSource(canvas);
    const hybridBinarizer = new library.HybridBinarizer(luminanceSource);
    return new library.BinaryBitmap(hybridBinarizer);
  }
  /**
   * Overwriting this allows you to manipulate the snapshot image in anyway you want before decode.
   */
  static drawImageOnCanvas(canvasElementContext, srcElement) {
    canvasElementContext.drawImage(srcElement, 0, 0);
  }
  static getMediaElementDimensions(mediaElement) {
    if (mediaElement instanceof HTMLVideoElement) {
      return {
        height: mediaElement.videoHeight,
        width: mediaElement.videoWidth
      };
    }
    if (mediaElement instanceof HTMLImageElement) {
      return {
        height: mediaElement.naturalHeight || mediaElement.height,
        width: mediaElement.naturalWidth || mediaElement.width
      };
    }
    throw new Error("Couldn't find the Source's dimensions!");
  }
  /**
   * 🖌 Prepares the canvas for capture and scan frames.
   */
  static createCaptureCanvas(mediaElement) {
    if (!mediaElement) {
      throw new library.ArgumentException("Cannot create a capture canvas without a media element.");
    }
    if (typeof document === "undefined") {
      throw new Error(`The page "Document" is undefined, make sure you're running in a browser.`);
    }
    const canvasElement = document.createElement("canvas");
    const { width, height } = BrowserCodeReader.getMediaElementDimensions(mediaElement);
    canvasElement.style.width = width + "px";
    canvasElement.style.height = height + "px";
    canvasElement.width = width;
    canvasElement.height = height;
    return canvasElement;
  }
  /**
   * Just tries to play the video and logs any errors.
   * The play call is only made is the video is not already playing.
   */
  static async tryPlayVideo(videoElement) {
    if (videoElement?.ended) {
      console.error("Trying to play video that has ended.");
      return false;
    }
    if (BrowserCodeReader.isVideoPlaying(videoElement)) {
      console.warn("Trying to play video that is already playing.");
      return true;
    }
    try {
      await videoElement.play();
      return true;
    } catch (error) {
      console.warn("It was not possible to play the video.", error);
      return false;
    }
  }
  /**
   * Creates a canvas and draws the current image frame from the media element on it.
   *
   * @param mediaElement HTML media element to extract an image frame from.
   */
  static createCanvasFromMediaElement(mediaElement) {
    const canvas = BrowserCodeReader.createCaptureCanvas(mediaElement);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Couldn't find Canvas 2D Context.");
    }
    BrowserCodeReader.drawImageOnCanvas(ctx, mediaElement);
    return canvas;
  }
  /**
   * Creates a binaryBitmap based in some image source.
   *
   * @param mediaElement HTML element containing drawable image source.
   */
  static createBinaryBitmapFromMediaElem(mediaElement) {
    const canvas = BrowserCodeReader.createCanvasFromMediaElement(mediaElement);
    return BrowserCodeReader.createBinaryBitmapFromCanvas(canvas);
  }
  static destroyImageElement(imageElement) {
    imageElement.src = "";
    imageElement.removeAttribute("src");
  }
  /**
   * Lists all the available video input devices.
   */
  static async listVideoInputDevices() {
    if (!navigatorUtils.hasNavigator()) {
      throw new Error("Can't enumerate devices, navigator is not present.");
    }
    if (!navigatorUtils.canEnumerateDevices()) {
      throw new Error("Can't enumerate devices, method not supported.");
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = [];
    for (const device of devices) {
      const kind = device.kind === "video" ? "videoinput" : device.kind;
      if (kind !== "videoinput") {
        continue;
      }
      const deviceId = device.deviceId || device.id;
      const label = device.label || `Video device ${videoDevices.length + 1}`;
      const groupId = device.groupId;
      const videoDevice = { deviceId, label, kind, groupId };
      videoDevices.push(videoDevice);
    }
    return videoDevices;
  }
  /**
   * Let's you find a device using it's Id.
   */
  static async findDeviceById(deviceId) {
    const devices = await BrowserCodeReader.listVideoInputDevices();
    if (!devices) {
      return;
    }
    return devices.find((x) => x.deviceId === deviceId);
  }
  /**
   * Unbinds a HTML video src property.
   */
  static cleanVideoSource(videoElement) {
    if (!videoElement) {
      return;
    }
    try {
      videoElement.srcObject = null;
    } catch (err) {
      videoElement.src = "";
    }
    if (videoElement) {
      videoElement.removeAttribute("src");
    }
  }
  /**
   * Stops all media streams that are created.
   */
  static releaseAllStreams() {
    if (BrowserCodeReader.streamTracker.length !== 0) {
      BrowserCodeReader.streamTracker.forEach((mediaStream) => {
        mediaStream.getTracks().forEach((track) => track.stop());
      });
    }
    BrowserCodeReader.streamTracker = [];
  }
  /**
   * Waits for a video to load and then hits play on it.
   * To accomplish that, it binds listeners and callbacks to the video element.
   *
   * @param element The video element.
   * @param callbackFn Callback invoked when the video is played.
   */
  static async playVideoOnLoadAsync(element, timeout) {
    const isPlaying = await BrowserCodeReader.tryPlayVideo(element);
    if (isPlaying) {
      return true;
    }
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (BrowserCodeReader.isVideoPlaying(element)) {
          return;
        }
        reject(false);
        element.removeEventListener("canplay", videoCanPlayListener);
      }, timeout);
      const videoCanPlayListener = () => {
        BrowserCodeReader.tryPlayVideo(element).then((hasPlayed) => {
          clearTimeout(timeoutId);
          element.removeEventListener("canplay", videoCanPlayListener);
          resolve(hasPlayed);
        });
      };
      element.addEventListener("canplay", videoCanPlayListener);
    });
  }
  /**
   * Sets the new stream and request a new decoding-with-delay.
   *
   * @param stream The stream to be shown in the video element.
   * @param decodeFn A callback for the decode method.
   */
  static async attachStreamToVideo(stream, preview, previewPlayTimeout = 5e3) {
    const videoElement = BrowserCodeReader.prepareVideoElement(preview);
    BrowserCodeReader.addVideoSource(videoElement, stream);
    await BrowserCodeReader.playVideoOnLoadAsync(videoElement, previewPlayTimeout);
    return videoElement;
  }
  /**
   * Keeps track to created media streams.
   * @private there is no need this array to be accessible from outside.
   */
  static streamTracker = [];
  /**
   * Returns a Promise that resolves when the given image element loads.
   */
  static _waitImageLoad(element) {
    return new Promise((resolve, reject) => {
      const timeout = 1e4;
      const timeoutId = setTimeout(() => {
        if (BrowserCodeReader.isImageLoaded(element)) {
          return;
        }
        element.removeEventListener("load", imageLoadedListener);
        reject();
      }, timeout);
      const imageLoadedListener = () => {
        clearTimeout(timeoutId);
        element.removeEventListener("load", imageLoadedListener);
        resolve();
      };
      element.addEventListener("load", imageLoadedListener);
    });
  }
  /**
   * Checks if the `callbackFn` is defined, otherwise throws.
   */
  static checkCallbackFnOrThrow(callbackFn) {
    if (!callbackFn) {
      throw new library.ArgumentException("`callbackFn` is a required parameter, you cannot capture results without it.");
    }
  }
  /**
   * Standard method to dispose a media stream object.
   */
  static disposeMediaStream(stream) {
    stream.getVideoTracks().forEach((x) => x.stop());
  }
  /**
   * BrowserCodeReader specific configuration options.
   */
  options;
  /**
   * Gets the BinaryBitmap for ya! (and decodes it)
   */
  decode(element) {
    const canvas = BrowserCodeReader.createCanvasFromMediaElement(element);
    return this.decodeFromCanvas(canvas);
  }
  /**
   * Call the encapsulated readers decode
   */
  decodeBitmap(binaryBitmap) {
    return this.reader.decode(binaryBitmap, this.hints);
  }
  /**
   * Decodes some barcode from a canvas!
   */
  decodeFromCanvas(canvas) {
    const binaryBitmap = BrowserCodeReader.createBinaryBitmapFromCanvas(canvas);
    return this.decodeBitmap(binaryBitmap);
  }
  /**
   * Decodes something from an image HTML element.
   */
  async decodeFromImageElement(source) {
    if (!source) {
      throw new library.ArgumentException("An image element must be provided.");
    }
    const element = BrowserCodeReader.prepareImageElement(source);
    return await this._decodeOnLoadImage(element);
  }
  /**
   * Decodes an image from a URL.
   */
  async decodeFromImageUrl(url) {
    if (!url) {
      throw new library.ArgumentException("An URL must be provided.");
    }
    const element = BrowserCodeReader.prepareImageElement();
    element.src = url;
    try {
      return await this.decodeFromImageElement(element);
    } finally {
      BrowserCodeReader.destroyImageElement(element);
    }
  }
  /**
   * Continuously tries to decode the barcode from a stream obtained from the given constraints
   * while showing the video in the specified video element.
   *
   * @param {MediaStream} [constraints] the media stream constraints to get s valid media stream to decode from
   * @param {string|HTMLVideoElement} [previewElem] the video element in page where to show the video while
   *  decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in
   *  which case no video will be shown.
   */
  async decodeFromConstraints(constraints, previewElem, callbackFn) {
    BrowserCodeReader.checkCallbackFnOrThrow(callbackFn);
    const stream = await this.getUserMedia(constraints);
    try {
      return await this.decodeFromStream(stream, previewElem, callbackFn);
    } catch (error) {
      BrowserCodeReader.disposeMediaStream(stream);
      throw error;
    }
  }
  /**
   * In one attempt, tries to decode the barcode from a stream obtained from the given constraints
   * while showing the video in the specified video element.
   *
   * @param {MediaStream} [constraints] the media stream constraints to get s valid media stream to decode from
   * @param {string|HTMLVideoElement} [preview] the video element in page where to show the video
   *  while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined,
   *  in which case no video will be shown.
   */
  async decodeFromStream(stream, preview, callbackFn) {
    BrowserCodeReader.checkCallbackFnOrThrow(callbackFn);
    const timeout = this.options.tryPlayVideoTimeout;
    const video = await BrowserCodeReader.attachStreamToVideo(stream, preview, timeout);
    const finalizeCallback = () => {
      BrowserCodeReader.disposeMediaStream(stream);
      BrowserCodeReader.cleanVideoSource(video);
    };
    const originalControls = this.scan(video, callbackFn, finalizeCallback);
    const videoTracks = stream.getVideoTracks();
    const controls = {
      ...originalControls,
      stop() {
        originalControls.stop();
      },
      async streamVideoConstraintsApply(constraints, trackFilter) {
        const tracks = trackFilter ? videoTracks.filter(trackFilter) : videoTracks;
        for (const track of tracks) {
          await track.applyConstraints(constraints);
        }
      },
      streamVideoConstraintsGet(trackFilter) {
        return videoTracks.find(trackFilter).getConstraints();
      },
      streamVideoSettingsGet(trackFilter) {
        return videoTracks.find(trackFilter).getSettings();
      },
      streamVideoCapabilitiesGet(trackFilter) {
        return videoTracks.find(trackFilter).getCapabilities();
      }
    };
    const isTorchAvailable = BrowserCodeReader.mediaStreamIsTorchCompatible(stream);
    if (isTorchAvailable) {
      const torchTrack = videoTracks?.find((t) => BrowserCodeReader.mediaStreamIsTorchCompatibleTrack(t));
      const switchTorch = async (onOff) => {
        await BrowserCodeReader.mediaStreamSetTorch(torchTrack, onOff);
      };
      controls.switchTorch = switchTorch;
      controls.stop = async () => {
        originalControls.stop();
        await switchTorch(false);
      };
    }
    return controls;
  }
  /**
   * Continuously tries to decode the barcode from the device specified by device while showing
   * the video in the specified video element.
   *
   * @param {string|null} [deviceId] the id of one of the devices obtained after calling
   *  getVideoInputDevices. Can be undefined, in this case it will decode from one of the
   *  available devices, preferring the main camera (environment facing) if available.
   * @param {string|HTMLVideoElement|null} [video] the video element in page where to show the video
   *  while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined,
   *  in which case no video will be shown.
   */
  async decodeFromVideoDevice(deviceId, previewElem, callbackFn) {
    BrowserCodeReader.checkCallbackFnOrThrow(callbackFn);
    let videoConstraints;
    if (!deviceId) {
      videoConstraints = { facingMode: "environment" };
    } else {
      videoConstraints = { deviceId: { exact: deviceId } };
    }
    const constraints = { video: videoConstraints };
    return await this.decodeFromConstraints(constraints, previewElem, callbackFn);
  }
  /**
   * Decodes something from an image HTML element.
   */
  async decodeFromVideoElement(source, callbackFn) {
    BrowserCodeReader.checkCallbackFnOrThrow(callbackFn);
    if (!source) {
      throw new library.ArgumentException("A video element must be provided.");
    }
    const element = BrowserCodeReader.prepareVideoElement(source);
    const timeout = this.options.tryPlayVideoTimeout;
    await BrowserCodeReader.playVideoOnLoadAsync(element, timeout);
    return this.scan(element, callbackFn);
  }
  /**
   * Decodes a video from a URL until it ends.
   */
  async decodeFromVideoUrl(url, callbackFn) {
    BrowserCodeReader.checkCallbackFnOrThrow(callbackFn);
    if (!url) {
      throw new library.ArgumentException("An URL must be provided.");
    }
    const element = BrowserCodeReader.prepareVideoElement();
    element.src = url;
    const finalizeCallback = () => {
      BrowserCodeReader.cleanVideoSource(element);
    };
    const timeout = this.options.tryPlayVideoTimeout;
    await BrowserCodeReader.playVideoOnLoadAsync(element, timeout);
    const controls = this.scan(element, callbackFn, finalizeCallback);
    return controls;
  }
  /**
   * In one attempt, tries to decode the barcode from a stream obtained from the given
   * constraints while showing the video in the specified video element.
   *
   * @param constraints the media stream constraints to get s valid media stream to decode from
   * @param videoSource the video element in page where to show the video while decoding.
   *  Can be either an element id or directly an HTMLVideoElement. Can be undefined,
   *  in which case no video will be shown.
   *  The decoding result.
   */
  async decodeOnceFromConstraints(constraints, videoSource) {
    const stream = await this.getUserMedia(constraints);
    return await this.decodeOnceFromStream(stream, videoSource);
  }
  /**
   * In one attempt, tries to decode the barcode from a stream obtained from the given
   * constraints while showing the video in the specified video element.
   *
   * @param {MediaStream} [constraints] the media stream constraints to get s valid media stream to decode from
   * @param {string|HTMLVideoElement} [video] the video element in page where to show the video while decoding.
   *  Can be either an element id or directly an HTMLVideoElement. Can be undefined,
   *  in which case no video will be shown.
   */
  async decodeOnceFromStream(stream, preview) {
    const receivedPreview = Boolean(preview);
    const video = await BrowserCodeReader.attachStreamToVideo(stream, preview);
    try {
      const result = await this.scanOneResult(video);
      return result;
    } finally {
      if (!receivedPreview) {
        BrowserCodeReader.cleanVideoSource(video);
      }
    }
  }
  /**
   * In one attempt, tries to decode the barcode from the device specified by deviceId
   * while showing the video in the specified video element.
   *
   * @param deviceId the id of one of the devices obtained after calling getVideoInputDevices.
   *  Can be undefined, in this case it will decode from one of the available devices,
   *  preferring the main camera (environment facing) if available.
   * @param videoSource the video element in page where to show the video while decoding.
   *  Can be either an element id or directly an HTMLVideoElement. Can be undefined,
   *  in which case no video will be shown.
   */
  async decodeOnceFromVideoDevice(deviceId, videoSource) {
    let videoConstraints;
    if (!deviceId) {
      videoConstraints = { facingMode: "environment" };
    } else {
      videoConstraints = { deviceId: { exact: deviceId } };
    }
    const constraints = { video: videoConstraints };
    return await this.decodeOnceFromConstraints(constraints, videoSource);
  }
  /**
   * Decodes something from an image HTML element.
   */
  async decodeOnceFromVideoElement(source) {
    if (!source) {
      throw new library.ArgumentException("A video element must be provided.");
    }
    const element = BrowserCodeReader.prepareVideoElement(source);
    const timeout = this.options.tryPlayVideoTimeout;
    await BrowserCodeReader.playVideoOnLoadAsync(element, timeout);
    return await this.scanOneResult(element);
  }
  /**
   * Decodes a video from a URL.
   */
  async decodeOnceFromVideoUrl(url) {
    if (!url) {
      throw new library.ArgumentException("An URL must be provided.");
    }
    const element = BrowserCodeReader.prepareVideoElement();
    element.src = url;
    const task = this.decodeOnceFromVideoElement(element);
    try {
      return await task;
    } finally {
      BrowserCodeReader.cleanVideoSource(element);
    }
  }
  /**
   * Tries to decode from the video input until it finds some value.
   */
  scanOneResult(element, retryIfNotFound = true, retryIfChecksumError = true, retryIfFormatError = true) {
    return new Promise((resolve, reject) => {
      this.scan(element, (result, error, controls) => {
        if (result) {
          resolve(result);
          controls.stop();
          return;
        }
        if (error) {
          if (error instanceof library.NotFoundException && retryIfNotFound) {
            return;
          }
          if (error instanceof library.ChecksumException && retryIfChecksumError) {
            return;
          }
          if (error instanceof library.FormatException && retryIfFormatError) {
            return;
          }
          controls.stop();
          reject(error);
        }
      });
    });
  }
  /**
   * Continuously decodes from video input.
   *
   * @param element HTML element to scan/decode from. It will not be disposed or destroyed.
   * @param callbackFn Called after every scan attempt, being it successful or errored.
   * @param finalizeCallback Called after scan process reaches the end or stop is called.
   */
  scan(element, callbackFn, finalizeCallback) {
    BrowserCodeReader.checkCallbackFnOrThrow(callbackFn);
    let captureCanvas = BrowserCodeReader.createCaptureCanvas(element);
    let captureCanvasContext;
    try {
      captureCanvasContext = captureCanvas.getContext("2d", { willReadFrequently: true });
    } catch (e) {
      captureCanvasContext = captureCanvas.getContext("2d");
    }
    if (!captureCanvasContext) {
      throw new Error("Couldn't create canvas for visual element scan.");
    }
    const disposeCanvas = () => {
      captureCanvasContext = void 0;
      captureCanvas = void 0;
    };
    let stopScan = false;
    let lastTimeoutId;
    const stop = () => {
      stopScan = true;
      clearTimeout(lastTimeoutId);
      disposeCanvas();
      if (finalizeCallback) {
        finalizeCallback();
      }
    };
    const controls = { stop };
    const loop = () => {
      if (stopScan) {
        return;
      }
      try {
        BrowserCodeReader.drawImageOnCanvas(captureCanvasContext, element);
        const result = this.decodeFromCanvas(captureCanvas);
        callbackFn(result, void 0, controls);
        lastTimeoutId = setTimeout(loop, this.options.delayBetweenScanSuccess);
      } catch (error) {
        callbackFn(void 0, error, controls);
        const isChecksumError = error instanceof library.ChecksumException;
        const isFormatError = error instanceof library.FormatException;
        const isNotFound = error instanceof library.NotFoundException;
        if (isChecksumError || isFormatError || isNotFound) {
          lastTimeoutId = setTimeout(loop, this.options.delayBetweenScanAttempts);
          return;
        }
        disposeCanvas();
        if (finalizeCallback) {
          finalizeCallback(error);
        }
      }
    };
    loop();
    return controls;
  }
  /**
   * Waits for the image to load and then tries to decode it.
   */
  async _decodeOnLoadImage(element) {
    const isImageLoaded = BrowserCodeReader.isImageLoaded(element);
    if (!isImageLoaded) {
      await BrowserCodeReader._waitImageLoad(element);
    }
    return this.decode(element);
  }
  /**
   * Get MediaStream from browser to be used.
   * @param constraints constraints the media stream constraints to get s valid media stream to decode from.
   * @private For private use.
   */
  async getUserMedia(constraints) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    BrowserCodeReader.streamTracker.push(stream);
    return stream;
  }
}

exports.BrowserCodeReader = BrowserCodeReader;
//# sourceMappingURL=BrowserCodeReader.cjs.map
//# sourceMappingURL=BrowserCodeReader.cjs.map