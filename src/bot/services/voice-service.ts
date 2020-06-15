import WebSocketStream from "websocket-stream";
import config from "../config";
import { EventEmitter } from "events";
import { VoiceCommands } from "models/voice-commands";
import { Readable } from "stream";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

export type DataCallback = (data: string) => void;
export type CommandCallback = (command: VoiceCommands) => void;
export type ErrorCallback = (error: Error) => void;

export interface VoiceService {
  addListener(event: "close", listener: ErrorCallback): this;
  addListener(event: "command", listener: CommandCallback): this;
  addListener(event: "data", listener: DataCallback): this;
  addListener(event: "error", listener: ErrorCallback): this;
  addListener(event: "wakeword", listener: () => void): this;

  emit(event: "wakeword"): this;
  emit(event: "error", error: Error): boolean;
  emit(event: "close", error: Error): boolean;
  emit(event: "command", command: VoiceCommands): boolean;
  emit(event: "data", data: string): boolean;

  on(event: "close", listener: ErrorCallback): this;
  on(event: "command", listener: CommandCallback): this;
  on(event: "data", listener: DataCallback): this;
  on(event: "error", listener: ErrorCallback): this;
  on(event: "wakeword", listener: () => void): this;

  once(event: "close", listener: ErrorCallback): this;
  once(event: "command", listener: CommandCallback): this;
  once(event: "data", listener: DataCallback): this;
  once(event: "error", listener: ErrorCallback): this;
  once(event: "wakeword", listener: () => void): this;

  prependListener(event: "close", listener: ErrorCallback): this;
  prependListener(event: "command", listener: CommandCallback): this;
  prependListener(event: "data", listener: DataCallback): this;
  prependListener(event: "error", listener: ErrorCallback): this;
  prependListener(event: "wakeword", listener: () => void): this;

  prependOnceListener(event: "close", listener: ErrorCallback): this;
  prependOnceListener(event: "command", listener: CommandCallback): this;
  prependOnceListener(event: "data", listener: DataCallback): this;
  prependOnceListener(event: "error", listener: ErrorCallback): this;
  prependOnceListener(event: "wakeword", listener: () => void): this;

  removeListener(event: "close", listener: ErrorCallback): this;
  removeListener(event: "command", listener: CommandCallback): this;
  removeListener(event: "data", listener: DataCallback): this;
  removeListener(event: "error", listener: ErrorCallback): this;
  removeListener(event: "wakeword", listener: () => void): this;
}

export class VoiceService extends EventEmitter implements VoiceService {
  private _ws: WebSocketStream.WebSocketDuplex;

  constructor() {
    super();

    const commands = Object.values(VoiceCommands);

    // eslint-disable-next-line new-cap
    this._ws = WebSocketStream(config.ws);

    this._ws
      .on("error", (err: Error) => {
        this.emit("error", err);
      })
      .on("close", (err: Error) => {
        this.emit("close", err);
      })
      .on("data", async (wsData: Buffer) => {
        const result = wsData.toString();

        if (result === "wakeword detected") {
          this.emit("wakeword");
        } else if (commands.includes(result as VoiceCommands)) {
          this.emit("command", result as VoiceCommands);
        } else {
          this.emit("data", result);
        }
      });
  }

  public recognize(stream: Readable) {
    this._encodeVoskAudioStream(stream).pipe(this._ws);
  }

  private _encodeVoskAudioStream = (stream: Readable): any => {
    return ffmpeg(stream)
      .inputFormat("s32le")
      .audioFrequency(16000)
      .audioChannels(1)
      .audioCodec("pcm_s16le")
      .outputOptions("-bufsize 1024")
      .format("s16le");
  };
}
