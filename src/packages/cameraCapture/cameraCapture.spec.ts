import { describe, test, expect } from "vitest";
import CameraCapture from "./cameraCapture";

describe("getFrameNumbers", () => {
  type TestCase = [number, number, number[]];

  // [totalFrames, numberFramesToCapture, expected result]
  const TEST_CASES: TestCase[] = [
    [0, 0, []],
    [0, 3, []],
    [4, 2, [0, 2]],
    [4, 3, [0, 1, 2]],
    [10, 1, [0]],
    [10, 3, [0, 3, 6]],
  ];

  test.each<TestCase>(TEST_CASES)(
    "given %j as totalFrames count, %j as number of frames to capture, it should return %j",
    (totalFrames, numberFramesToCapture, expectedResult) => {
      const { getFrameNumbers } = new CameraCapture();
      const actualResult = getFrameNumbers(totalFrames, numberFramesToCapture);
      expect(actualResult).toEqual(expectedResult);
    }
  );
});

describe("getFrameNumberByElapsedTime", () => {
  type TestCase = [number, number, number, number];

  // [timestamp, totalFrames, playbackFrameRate, expected result]
  const TEST_CASES: TestCase[] = [
    [0, 0, 15, 0],
    [0.12, 300, 30, 4],
    [0.52, 300, 30, 16],
  ];

  test.each<TestCase>(TEST_CASES)(
    "given %j as timeStamp, %j as totalFrames, %j as framerate it should return %j",
    (timeStamp, totalFrames, playbackFramerate, expectedResult) => {
      const { getFrameNumberByElapsedTime } = new CameraCapture();
      const actualResult = getFrameNumberByElapsedTime(
        timeStamp,
        totalFrames,
        playbackFramerate
      );
      expect(actualResult).toEqual(expectedResult);
    }
  );
});
