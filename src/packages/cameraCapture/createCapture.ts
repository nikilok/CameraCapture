import { Config } from "./types";
import CameraCapture from "./cameraCapture";
import { DEFAULT_CONFIG } from "./config";

interface ReturnType {
  getFoo: () => string;
}

export default function createCapture(
  config: Config = DEFAULT_CONFIG
): ReturnType {
  const { getFoo } = new CameraCapture(config);

  return {
    getFoo,
  };
}
