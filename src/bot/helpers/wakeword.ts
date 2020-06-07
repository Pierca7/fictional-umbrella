/* eslint-disable no-console */
import * as cp from "child_process";
import path from "path";
import { Writable } from "stream";
import { EventEmitter } from "events";

export type DataCallback = (data: any) => any;
export type ErrorCallback = (error: Error) => any;

export interface WakewordClientOptions {
  onData: DataCallback;
  onError: ErrorCallback;
}

export interface WakewordClient {
  addListener(event: "keyword", listener: (keyword: Buffer) => void): this;
  addListener(event: "error", listener: (error: Error) => void): this;

  emit(event: "keyword", keyword: Buffer): boolean;
  emit(event: "error", error: Error): boolean;

  on(event: "keyword", listener: (keyword: Buffer) => void): this;
  on(event: "error", listener: (error: Error) => void): this;

  once(event: "keyword", listener: (keyword: Buffer) => void): this;
  once(event: "error", listener: (error: Error) => void): this;

  prependListener(event: "keyword", listener: (keyword: Buffer) => void): this;
  prependListener(event: "error", listener: (error: Error) => void): this;

  prependOnceListener(
    event: "keyword",
    listener: (keyword: Buffer) => void,
  ): this;
  prependOnceListener(event: "error", listener: (error: Error) => void): this;

  removeListener(event: "keyword", listener: (keyword: Buffer) => void): this;
  removeListener(event: "error", listener: (error: Error) => void): this;
}

export class WakewordClient extends EventEmitter implements WakewordClient {
  private _client: cp.ChildProcessWithoutNullStreams;

  protected constructor() {
    super();

    this._client = cp.spawn("python3", [
      path.join(process.cwd(), "src\\voice-client\\voice-client.py"),
    ]);

    this._client.stdout.on("data", keyword => {
      this.emit("keyword", keyword);
    });

    this._client.stderr.on("error", error => {
      this.emit("error", error);
    });
  }

  public static create(): WakewordClient {
    return new WakewordClient();
  }

  public get input(): Writable {
    return this._client.stdin;
  }
}
