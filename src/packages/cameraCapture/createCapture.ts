import { Config } from "./types";
import CameraCapture from "./cameraCapture";
import { DEFAULT_CONFIG } from "./config";

interface ReturnType {
  getFoo: () => string | undefined;
  getMediaStream: () => Promise<MediaStream | undefined>;
}

export default function createCapture(
  config: Config = DEFAULT_CONFIG
): ReturnType {
  const { getFoo, getMediaStream } = new CameraCapture(config);

  return {
    getFoo,
    getMediaStream,
  };
}
