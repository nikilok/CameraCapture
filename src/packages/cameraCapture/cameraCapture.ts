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
      const frameNumber = i * interval;
      output.push(frameNumber);
    }
    return output;
  };

  /**
   * Fn that returns the frame number based on timestamp
   * @param timeStamp number
   * @param totalFrames number
   * @param playbackFramerate number
   * @returns number
   */
  getFrameNumberByElapsedTime = (
    timeStamp: number,
    totalFrames: number,
    playbackFramerate: number
  ): number => {
    const frameNumber = Math.round(timeStamp * playbackFramerate);

    if (frameNumber < 0 || frameNumber > totalFrames) {
      return NaN;
    }

    return frameNumber;
  };

  /**
   * Fn that gives you a callback function, along with total duration in seconds to capture,
   * and numberFramesToCapture as shots. The function will trigger the callback just before
   * a shot is taken allowing the application to do anything before a shot is taken.
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

    const trackProcessor = new MediaStreamTrackProcessor(videoTrack);

    const reader = trackProcessor.readable.getReader();

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
      const elapsedTime = +((frame.timestamp - startTime) / 10e5);

      // if elapsed time is less than the overall duration keep the stream alive
      if (elapsedTime <= durationInSeconds) {
        const currentFrameNumber = this.getFrameNumberByElapsedTime(
          elapsedTime,
          totalFrames,
          frameRate
        );

        if (currentFrameNumber >= framesToCapture[capturedFrames]) {
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
