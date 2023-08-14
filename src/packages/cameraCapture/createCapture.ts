import { CaptureImagesOptions, Config } from "./types";
import CameraCapture from "./cameraCapture";
import { DEFAULT_CONFIG } from "./config";
import { convertImageBitMapToString } from "./imageBitMapToUrl";

interface createCaptureResponse {
  startMediaStream: () => Promise<MediaStream | undefined>;
  captureImages: (options: CaptureImagesOptions) => void;
  convertImageBitMapToString: (imageBitMap: ImageBitmap) => Promise<string>;
}

export default function createCapture(
  config: Config = DEFAULT_CONFIG
): createCaptureResponse {
  const { startMediaStream, captureImages } = new CameraCapture(config);

  return {
    startMediaStream,
    captureImages,
    convertImageBitMapToString,
  };
}
