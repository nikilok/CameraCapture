export interface Config {
  foo?: string;
  media?: {
    frontFacing?: boolean;
    idealCameraWidth?: number;
    idealCameraHeight?: number;
  };
}

export interface VideoTrack {
  stop(): unknown;
  track: MediaStreamTrack;
  getSettings: () => { frameRate: number };
}
