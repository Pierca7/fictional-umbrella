/* eslint-disable no-console */
import { Message } from "discord.js";
import { joinVoiceChannel } from "bot/helpers/join-channel";
import path from "path";

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

    const stream = connection.receiver.createStream(message, {
      mode: "pcm",
      end: "manual",
    });

    stream.on("data", chunk => console.log(chunk));
  } catch (error) {
    console.error(error);
  }
};

export default hear;
