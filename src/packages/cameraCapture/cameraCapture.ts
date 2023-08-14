import { Config, VideoTrack } from "./types";
import { DEFAULT_CONFIG } from "./config";

declare class MediaStreamTrackProcessor {
  constructor(init: { track: MediaStreamTrack });
  readonly readable: ReadableStream<VideoFrame>;
}

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

  getMediaStream = () => this.mediaStream;

  /**
   * Start the media stream
   * @returns Promise<MediaStream>
   */
  startMediaStream = async () => {
    let mediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(this.videoConfig);
      this.setMediaStream(mediaStream);
      return this.getMediaStream();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err);
    }
  };

  // A function that returns an array of equally spaced frame numbers
  getFrameNumbers = (totalFrames: number, captureFrames: number) => {
    // Check if the input is valid
    if (totalFrames <= 0 || captureFrames <= 0 || captureFrames > totalFrames) {
      return [];
    }
    // Initialize the output array
    const output = [];
    // Calculate the interval between frames
    const interval = Math.floor(totalFrames / captureFrames);
    // Loop through the capture frames
    for (let i = 0; i < captureFrames; i++) {
      // Calculate the frame number
      const frameNumber = i * interval + 2;
      output.push(frameNumber);
    }
    return output;
  };

  getElapsedTimesMap = (totalFrames: number, playbackFramerate: number) => {
    // Check if the input is valid
    if (totalFrames <= 0 || playbackFramerate <= 0) {
      return new Map();
    }
    const output = new Map();
    // Calculate the duration of each frame in seconds
    const frameDuration = 1 / playbackFramerate;
    // Loop through the total frames
    for (let i = 0; i < totalFrames; i++) {
      const frameNumber = i + 1;
      // Calculate the elapsed time in seconds
      const elapsedTime = +(i * frameDuration).toFixed(1);
      // Set the key-value pair in the output map
      output.set(elapsedTime, frameNumber);
    }
    return output;
  };

  captureImages = async (
    callBack: (count: number) => void,
    durationInSeconds: number = 10,
    numberFramesToCapture: number = 10
  ) => {
    let startTime = null;
    let capturedFrames = 0;

    const videoTrack =
      this.getMediaStream()?.getVideoTracks()[0] as unknown as VideoTrack;
    const { frameRate } = videoTrack.getSettings();
    const totalFrames = frameRate * durationInSeconds;
    // get evenly distributed array of frames to capture
    const framesToCapture = this.getFrameNumbers(
      totalFrames,
      numberFramesToCapture
    );
    // get a map of elapsed time to frame number
    const elapsedTimeMap = this.getElapsedTimesMap(totalFrames, frameRate);

    const trackProcessor = new MediaStreamTrackProcessor(videoTrack);

    const reader = trackProcessor.readable.getReader();
    let lastElapsedTime = null;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = await reader.read();
      if (result.done) break;

      const frame = result.value;
      // If start time is not set, set it to the first frame's timestamp
      if (startTime === null) {
        startTime = frame.timestamp;
      }

      // Calculate the elapsed time in seconds
      const elapsedTime = +((frame.timestamp - startTime) / 10e5).toFixed(1);

      // if elapsed time is less than the overall duration keep the stream alive
      if (elapsedTime <= durationInSeconds) {
        // Correlate elapsedtime (Map, with key elapsedtime to frameNumber) and
        // ensure they exist in the evenly spread out framesToCapture array.
        // If so capture run routine to capture frame, and callback application layer.
        if (
          framesToCapture.includes(elapsedTimeMap.get(elapsedTime)) &&
          elapsedTime != lastElapsedTime
        ) {
          lastElapsedTime = elapsedTime;
          capturedFrames++;
          callBack(capturedFrames);
        }
        frame.close();
      } else {
        console.log("Time out", elapsedTime, durationInSeconds);
        reader.cancel();
        frame.close();
      }
    }
  };
}
