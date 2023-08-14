import { CaptureImagesOptions, Config, VideoTrack } from "./types";
import { DEFAULT_CONFIG } from "./config";

declare class MediaStreamTrackProcessor {
  constructor(init: { track: MediaStreamTrack });
  readonly readable: ReadableStream<VideoFrame>;
}

export default class CameraCapture {
  private videoConfig: MediaStreamConstraints;
  private mediaStream: MediaStream | undefined;

  constructor(config: Config = DEFAULT_CONFIG) {
    this.videoConfig = this.getMediaConfig(config);
  }

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

  /**
   * A function that returns an array of equally spaced frame numbers, given
   * the totalFrames and number of frames to capture.
   * @param totalFrames number
   * @param numberFramesToCapture number
   * @returns number []
   */
  getFrameNumbers = (
    totalFrames: number,
    numberFramesToCapture: number
  ): number[] => {
    // Check if the input is valid
    if (
      totalFrames <= 0 ||
      numberFramesToCapture <= 0 ||
      numberFramesToCapture > totalFrames
    ) {
      return [];
    }
    const output = [];
    // Calculate the interval between frames
    const interval = Math.floor(totalFrames / numberFramesToCapture);
    // Loop through the capture frames
    for (let i = 0; i < numberFramesToCapture; i++) {
      // Calculate the frame number
      const frameNumber = i * interval + 2;
      output.push(frameNumber);
    }
    return output;
  };

  /**
   * Fn that returns an elapsed time Eg: 0.2 -> Frame No (Eg: 1)
   * @param totalFrames number
   * @param playbackFramerate number
   * @returns Map<milliseconds, frameNo>
   */
  getElapsedTimeToFrameNosMap = (
    totalFrames: number,
    playbackFramerate: number
  ) => {
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

  /**
   * Fn that gives you a callback function, along with total duration in seconds to capture,
   * and numberFramesToCapture as shots. The function will trigger the callback just before
   * a shot is taken allowing the application to do anything before a shot is taken.
   * @param callBack (count) => void
   * @param durationInSeconds number
   * @param numberFramesToCapture number
   */
  captureImages = async ({
    beforeCaptureImageHandle,
    onImageCaptureHandle,
    durationInSeconds = 10,
    numberFramesToCapture = 10,
  }: CaptureImagesOptions) => {
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
    const elapsedTimeToFrameNoMap = this.getElapsedTimeToFrameNosMap(
      totalFrames,
      frameRate
    );

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
          framesToCapture.includes(elapsedTimeToFrameNoMap.get(elapsedTime)) &&
          elapsedTime != lastElapsedTime
        ) {
          lastElapsedTime = elapsedTime;
          capturedFrames++;
          beforeCaptureImageHandle(capturedFrames);
          const imageBitMap = await createImageBitmap(frame);
          onImageCaptureHandle(imageBitMap);
        }
        frame.close();
      } else {
        console.log("Time out", elapsedTime, durationInSeconds);
        reader.cancel();
        frame.close();
        videoTrack.stop();
      }
    }
  };
}
