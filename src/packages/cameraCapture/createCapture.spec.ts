import { describe, test, expect } from "vitest";
import { createCapture } from ".";

describe("createCapture", () => {
  test("verify the signature of createCapture", () => {
    const response = createCapture();

    expect(response).toMatchInlineSnapshot(`
      {
        "captureImages": [Function],
        "convertImageBitMapToString": [Function],
        "startMediaStream": [Function],
      }
    `);
  });
});
