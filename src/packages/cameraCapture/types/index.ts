/// <reference types="webrtc" />
export interface Config {
  foo?: string;
  media?: {
    frontFacing?: boolean;
    idealCameraWidth?: number;
    idealCameraHeight?: number;
  };
}
