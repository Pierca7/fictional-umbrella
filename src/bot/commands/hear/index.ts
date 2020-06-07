/* eslint-disable no-console */
import { Message, VoiceReceiver, UserResolvable } from "discord.js";
import { joinVoiceChannel } from "bot/helpers/join-channel";
import path from "path";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { WakewordClient } from "../../helpers/wakeword";
import config from "../../config";
import { Readable } from "stream";
import WebSocketStream from "websocket-stream";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

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

export let ws: WebSocketStream.WebSocketDuplex;
export let baseStream: Readable;

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

    baseStream = connection.receiver.createStream(message, {
      mode: "pcm",
      end: "manual",
    });

    const wakewordStream = encodePorcupineAudioStream(baseStream);
    wakewordStream.pipe(wakewordClient.input);

    wakewordClient.on("keyword", data => {
      console.log(`Keyword detected: ${data.toString()}`);

      baseStream.unpipe();

      // eslint-disable-next-line new-cap
      ws = WebSocketStream(config.ws);

      ws.on("error", (err: Error) => {
        if (err) throw err;
      })
        .on("close", (err: Error) => {
          if (err) throw err;
          console.log(`Closing ws`);
        })
        .on("data", (wsData: any) => {
          const result = JSON.parse(wsData.toString());

          if (!result.text) {
            return;
          }

          console.log(result.text);
        });

      encodeVoskAudioStream(baseStream).pipe(ws);
    });

    wakewordClient.on("error", data => console.log(data.toString()));
  } catch (error) {
    console.error(error);
  }
};

export default hear;
