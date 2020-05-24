/* eslint-disable no-console */
import * as cp from "child_process";
import path from "path";
import { Writable } from "stream";

export type DataCallback = (data: any) => any;
export type ErrorCallback = (error: Error) => any;

class WakewordClient {
  private _client: cp.ChildProcessWithoutNullStreams;

  constructor(onData: DataCallback) {
    this._client = cp.spawn("python3", [
      path.join(process.cwd(), "src\\voice-client\\voice-client.py"),
    ]);

    this._client.stdout.on("data", data => onData(data));
    this._client.stderr.on("data", error => console.log(error.toString()));
  }

  public get input(): Writable {
    return this._client.stdin;
  }
}

export default WakewordClient;
