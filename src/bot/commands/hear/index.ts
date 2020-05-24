/* eslint-disable no-console */
import { Message } from "discord.js";
import { joinVoiceChannel } from "bot/helpers/join-channel";
import path from "path";
import WakewordClient from "bot/helpers/wakeword";

const hear = async (message: Message): Promise<void> => {
  try {
    const connection = await joinVoiceChannel(message);
    const wakewordClient = new WakewordClient();

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

    stream.on("data", chunk => wakewordClient.process(chunk));
    wakewordClient.onData(data => console.log(data.toString()));
  } catch (error) {
    console.error(error);
  }
};

export default hear;
