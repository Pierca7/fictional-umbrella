/* eslint-disable no-console */
import path from "path";
import { Message, TextChannel } from "discord.js";
import { joinVoiceChannel } from "helpers/join-channel";
import { VoiceService } from "services/voice-service";
import { VoiceCommands } from "models/voice-commands";
import VoiceRadio from "commands/voice-commands/voice-commands";

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

    const audio = connection.receiver.createStream(message, {
      mode: "pcm",
      end: "manual",
    });

    const voiceService = new VoiceService();
    const voiceRadio = new VoiceRadio(
      connection,
      message.channel as TextChannel,
    );

    voiceService.recognize(audio);

    const reply = await message.reply("Waiting for wakeword...");

    voiceService
      .on("wakeword", async () => {
        await reply.edit("Waiting for command...");
      })
      .on("command", async (command: VoiceCommands) => {
        switch (command) {
          default:
            break;
          case VoiceCommands.Play:
            await reply.edit("Waiting for song...");
            break;
          case VoiceCommands.Resume:
            voiceRadio.resume();
            break;
          case VoiceCommands.Pause:
            voiceRadio.pause();
            break;
          case VoiceCommands.Stop:
            voiceRadio.stop();
            break;
          case VoiceCommands.VolumeUp:
            voiceRadio.volumeUp();
            break;
          case VoiceCommands.VolumeDown:
            voiceRadio.volumeDown();
            break;
          case VoiceCommands.Queue:
            message.channel.send(voiceRadio.queue);
            break;
        }
      })
      .on("data", async (data: string) => {
        await reply.edit(`Searching for ${data}`);

        const song = await voiceRadio.search(data);

        await voiceRadio.playOnce(song);

        await reply.edit(`Now playing ${song.title}`);
      });
  } catch (error) {
    console.error(error);
  }
};

export default hear;
