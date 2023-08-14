import { Config } from "./types";
import CameraCapture from "./cameraCapture";
import { DEFAULT_CONFIG } from "./config";

interface createCaptureResponse {
  getFoo: () => string | undefined;
  startMediaStream: () => Promise<MediaStream | undefined>;
  captureImages: (
    callBack: (count: number) => void,
    durationInSeconds?: number,
    numberFramesToCapture?: number
  ) => void;
}

export default function createCapture(
  config: Config = DEFAULT_CONFIG
): createCaptureResponse {
  const { getFoo, startMediaStream, captureImages } = new CameraCapture(config);

  return {
    getFoo,
    startMediaStream,
    captureImages,
  };
}
