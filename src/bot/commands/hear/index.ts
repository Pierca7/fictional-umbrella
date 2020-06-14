/* eslint-disable no-console */
import { Message } from "discord.js";
import { joinVoiceChannel } from "bot/helpers/join-channel";
import path from "path";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { WakewordClient } from "../../helpers/wakeword";
import config from "../../config";
import { Readable } from "stream";
import WebSocketStream from "websocket-stream";
import ytdl from "ytdl-core";
import axios from "axios";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const encodeVoskAudioStream = (baseStream: Readable): FfmpegCommand => {
  return ffmpeg(baseStream)
    .inputFormat("s32le")
    .audioFrequency(16000)
    .audioChannels(1)
    .audioCodec("pcm_s16le")
    .outputOptions("-bufsize 1024")
    .format("s16le");
};

export let ws: WebSocketStream.WebSocketDuplex;
export let baseStream: Readable;

let reply: Message;

const hear = async (message: Message): Promise<void> => {
  try {
    const connection = await joinVoiceChannel(message);

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

    // eslint-disable-next-line new-cap
    ws = WebSocketStream(config.ws);

    ws.on("error", (err: Error) => {
      if (err) throw err;
    })
      .on("close", (err: Error) => {
        if (err) throw err;
        console.log(`Closing ws`);
      })
      .on("data", async (wsData: any) => {
        const result = wsData.toString();

        if (result === "wakeword detected") {
          reply = await message.reply("Waiting for action...");
        } else if (result === "play") {
          await reply.edit("Play command detected. Waiting for song...");
        } else {
          await reply.edit(`Searching for ${result}...`);

          const videos = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                key: config.ytkey,
                part: "snippet",
                q: result,
                topicId: "/m/04rlf",
                type: "video",
              },
            },
          );

          const video = videos.data.items[0];
          const id = video.id.videoId;
          const title = video.snippet.title;

          connection.play(
            ytdl(`https://www.youtube.com/watch?v=${id}`, {
              quality: "highestaudio",
              filter: "audioonly",
            }),
          );

          await reply.edit(`Playing ${title}`);
        }
      });

    encodeVoskAudioStream(baseStream).pipe(ws);
  } catch (error) {
    console.error(error);
  }
};

export default hear;
