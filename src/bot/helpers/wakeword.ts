/* eslint-disable no-console */
import * as cp from "child_process";
import path from "path";

export type DataCallback = (data: any) => any;
export type ErrorCallback = (error: Error) => any;

class WakewordClient {
  private _client: cp.ChildProcessWithoutNullStreams;

  constructor() {
    this._client = cp.spawn("python3", [
      path.join(process.cwd(), "src\\voice-client\\voice-client.py"),
    ]);
  }

  public process(data: string, onError?: ErrorCallback): boolean {
    return this._client.stdin.write(data, onError);
  }

  public onData(callback: DataCallback) {
    this._client.stdout.on("data", data => callback(data));
  }
}

export default WakewordClient;
