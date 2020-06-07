/* eslint-disable no-console */
import { Message, VoiceReceiver, UserResolvable } from "discord.js";
import { joinVoiceChannel } from "bot/helpers/join-channel";
import path from "path";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { WakewordClient } from "../../helpers/wakeword";
import config from "../../config";
import WebSocket from "ws";
import { Readable } from "stream";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

let flag: boolean = false;

const encodePorcupineAudioStream = (baseStream: Readable): FfmpegCommand => {
  return ffmpeg(baseStream)
    .inputFormat("s32le")
    .audioFrequency(16000)
    .audioChannels(1)
    .audioCodec("pcm_s16le")
    .outputOptions("-bufsize 1024")
    .format("s16le");
};

const encodeVoskAudioStream = (baseStream: Readable): FfmpegCommand => {
  return ffmpeg(baseStream)
    .inputFormat("s32le")
    .audioFrequency(8000)
    .audioChannels(1)
    .audioCodec("pcm_s16le")
    .outputOptions("-bufsize 1024")
    .format("s16le");
};

export let ws: WebSocket;

const hear = async (message: Message): Promise<void> => {
  try {
    const connection = await joinVoiceChannel(message);
    const wakewordClient = WakewordClient.create();

    // We need to play a sound to be able to receive voice data.
    connection.play(
      path.join(process.cwd(), "src\\bot\\assets\\notification.wav"),
      {
        volume: 0.2,
      },
    );

    const baseStream = connection.receiver.createStream(message, {
      mode: "pcm",
      end: "manual",
    });

    const wakewordStream = encodePorcupineAudioStream(baseStream);
    wakewordStream.pipe(wakewordClient.input);

    wakewordClient.on("keyword", data => {
      console.log(`Keyword detected: ${data.toString()}`);

      baseStream.unpipe();

      if (flag) {
        return;
      }

      const output = encodeVoskAudioStream(baseStream);

      ws = new WebSocket(config.ws);

      ws.on("open", function open() {
        output.on("data", chunk => {
          ws.send(chunk);
        });
      });

      ws.on("message", function incoming(wsData) {
        console.log(wsData);
      });

      flag = true;
    });
    wakewordClient.on("error", data => console.log(data.toString()));
  } catch (error) {
    console.error(error);
  }
};

export default hear;
