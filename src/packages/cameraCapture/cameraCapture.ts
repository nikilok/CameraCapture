import { Config } from "./types";
import { DEFAULT_CONFIG } from "./config";

export default class CameraCapture {
  private foo: string | undefined;
  private videoConfig: MediaStreamConstraints;
  private mediaStream: MediaStream | undefined;

  constructor(config: Config = DEFAULT_CONFIG) {
    this.foo = config.foo;
    this.videoConfig = this.getMediaConfig(config);
  }

  getFoo = (): string | undefined => {
    return this.foo;
  };

  getMediaConfig = (mediaConfig: Config): MediaStreamConstraints => {
    return {
      video: {
        facingMode: mediaConfig.media?.frontFacing ? "user" : "enviornment",
        width: {
          ideal: mediaConfig?.media?.idealCameraWidth,
        },
        height: {
          ideal: mediaConfig?.media?.idealCameraHeight,
        },
      },
    };
  };

  setMediaStream = (mediaStream: MediaStream) =>
    (this.mediaStream = mediaStream);

  getMediaStream = async () => {
    let mediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(this.videoConfig);
      this.setMediaStream(mediaStream);
      return this.mediaStream;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err);
    }
  };
}
