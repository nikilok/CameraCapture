import { describe, test, expect } from "vitest";
import { createCapture } from ".";

describe("Invoke Configurations", () => {
  test("invoke cameraInstance without any config", () => {
    const cameraInstance = createCapture();
    expect(cameraInstance.getFoo()).toBe("bar");
  });

  test("invoke cameraInstance with a foo config", () => {
    const cameraInstance = createCapture({ foo: "foo-bar" });
    expect(cameraInstance.getFoo()).toBe("foo-bar");
  });

  test("should not be able to directly access foo", () => {
    const cameraInstance = createCapture({ foo: "foo-bar" });
    expect(cameraInstance).not.toHaveProperty("foo");
  });
});
