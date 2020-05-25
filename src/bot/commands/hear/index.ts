/* eslint-disable no-console */
import { Message, VoiceReceiver, UserResolvable } from "discord.js";
import { joinVoiceChannel } from "bot/helpers/join-channel";
import path from "path";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import WakewordClient from "bot/helpers/wakeword";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const createAudioStream = (
  receiver: VoiceReceiver,
  user: UserResolvable,
): FfmpegCommand => {
  const baseStream = receiver.createStream(user, {
    mode: "pcm",
    end: "manual",
  });

  return ffmpeg(baseStream)
    .inputFormat("s32le")
    .audioFrequency(16000)
    .audioChannels(1)
    .audioCodec("pcm_s16le")
    .outputOptions("-bufsize 1024")
    .format("s16le");
};

const hear = async (message: Message): Promise<void> => {
  try {
    const connection = await joinVoiceChannel(message);
    const wakewordClient = new WakewordClient(data =>
      console.log(data.toString()),
    );

    // We need to play a sound to be able to receive voice data.
    connection.play(
      path.join(process.cwd(), "src\\bot\\assets\\notification.wav"),
      {
        volume: 0.2,
      },
    );

    const audio = createAudioStream(connection.receiver, message.author);

    audio.pipe(wakewordClient.input, { end: false });
  } catch (error) {
    console.error(error);
  }
};

export default hear;
