/* eslint-disable no-console */
import path from "path";
import { Message } from "discord.js";
import { joinVoiceChannel } from "helpers/join-channel";
import { VoiceService } from "services/voice-service";
import { VoiceCommands } from "models/voice-commands";
import VoiceCommandsManager from "commands/voice-commands/voice-commands";

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
    const voiceCommandsManager = new VoiceCommandsManager(connection);

    voiceService.recognize(audio);

    const reply = await message.reply("Wating for wakeword...");

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
            voiceCommandsManager.resume();
            break;
          case VoiceCommands.Pause:
            voiceCommandsManager.pause();
            break;
          case VoiceCommands.VolumeUp:
            voiceCommandsManager.volumeUp();
            break;
          case VoiceCommands.VolumeDown:
            voiceCommandsManager.volumeDown();
            break;
        }
      })
      .on("data", async (data: string) => {
        await reply.edit(`Searching for ${data}`);

        const song = await voiceCommandsManager.search(data);

        await voiceCommandsManager.play(song);
      });
  } catch (error) {
    console.error(error);
  }
};

export default hear;
