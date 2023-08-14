import { describe, test, expect } from "vitest";
import CameraCapture from "./cameraCapture";

describe("getFrameNumbers", () => {
  type TestCase = [number, number, number[]];

  // [totalFrames, numberFramesToCapture, expected result]
  const TEST_CASES: TestCase[] = [
    [0, 0, []],
    [0, 3, []],
    [4, 2, [2, 4]],
    [4, 3, [2, 3, 4]],
    [10, 1, [2]],
    [10, 3, [2, 5, 8]],
  ];

  test.each<TestCase>(TEST_CASES)(
    "given %j as totalFrames count, %j as number of frames to capture, it should return %j",
    (totalFrames, numberFramesToCapture, expectedResult) => {
      const { getFrameNumbers } = new CameraCapture();
      const actualResult = getFrameNumbers(totalFrames, numberFramesToCapture);
      console.log(
        "🚀 ~ file: cameraCapture.spec.ts:18 ~ describe ~ actualResult:",
        actualResult
      );
      expect(actualResult).toEqual(expectedResult);
    }
  );
});

describe("getElapsedTimeToFrameNosMap", () => {
  type TestCase = [number, number, Map<number, number>];

  // [totalFrames, playbackFrameRate,
  // expected new Map([elapsedTime (in milliseconds), FrameNo])]
  const TEST_CASES: TestCase[] = [
    [0, 0, new Map([])],
    [
      30,
      5,
      new Map([
        [0, 1],
        [0.2, 2],
        [0.4, 3],
        [0.6, 4],
        [1, 6],
        [0.8, 5],
        [1.2, 7],
        [1.4, 8],
        [1.6, 9],
        [1.8, 10],
        [2, 11],
        [2.2, 12],
        [2.4, 13],
        [2.6, 14],
        [2.8, 15],
        [3, 16],
        [3.2, 17],
        [3.4, 18],
        [3.6, 19],
        [3.8, 20],
        [4, 21],
        [4.2, 22],
        [4.4, 23],
        [4.6, 24],
        [4.8, 25],
        [5, 26],
        [5.2, 27],
        [5.4, 28],
        [5.6, 29],
        [5.8, 30],
      ]),
    ],
  ];

  test.each<TestCase>(TEST_CASES)(
    "given %j as totalFrames count, %j as number of frames to capture, it should return %j",
    (totalFrames, playbackFrameRate, expectedResult) => {
      const { getElapsedTimeToFrameNosMap } = new CameraCapture();
      const actualResult = getElapsedTimeToFrameNosMap(
        totalFrames,
        playbackFrameRate
      );
      console.log(
        "🚀 ~ file: cameraCapture.spec.ts:44 ~ describe ~ actualResult:",
        actualResult
      );
      expect(actualResult).toEqual(expectedResult);
    }
  );
});
