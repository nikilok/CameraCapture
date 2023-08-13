import { Config } from "./types";
import { DEFAULT_CONFIG } from "./config";

export default class CameraCapture {
  private foo: string;

  constructor(config: Config = DEFAULT_CONFIG) {
    this.foo = config.foo;
  }

  getFoo = (): string => {
    return this.foo;
  };
}
