export interface Config {
  foo?: string;
  media?: {
    frontFacing?: boolean;
    idealCameraWidth?: number;
    idealCameraHeight?: number;
  };
}

export interface CaptureImagesOptions {
  beforeCaptureImageHandle: (count: number) => void;
  onImageCaptureHandle: (imageBitMap: ImageBitmap) => void;
  durationInSeconds?: number;
  numberFramesToCapture?: number;
}

export interface VideoTrack {
  stop(): unknown;
  track: MediaStreamTrack;
  getSettings: () => { frameRate: number };
}
