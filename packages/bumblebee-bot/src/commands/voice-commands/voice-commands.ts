import { VoiceConnection, StreamDispatcher, TextChannel } from "discord.js";
import { Readable } from "stream";
import YoutubeService from "services/youtube-service";
import Song from "models/song";
import { SongQueue } from "helpers/queue";
import { clamp } from "helpers/math";

export enum StreamingPlatform {
  Youtube,
  Spotify,
}

class VoiceRadio {
  private _connection: VoiceConnection;
  private _textChannel: TextChannel;
  private _stream: StreamDispatcher;
  private _queue: SongQueue;

  constructor(connection: VoiceConnection, textChannel: TextChannel) {
    this._connection = connection;
    this._textChannel = textChannel;
    this._queue = new SongQueue();
  }

  public get paused(): boolean {
    return this._stream && this._stream.paused;
  }

  public get queue(): string {
    return this._queue.toString();
  }

  public enqueue(song: Song): number {
    return this._queue.enqueue(song);
  }

  public pause(): void {
    this._stream && this._stream.pause();
  }

  public async play(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this._queue.isEmpty()) {
        return reject(
          "The current queue is empty. Please add a song before trying to play it.",
        );
      }

      await this.playNext();

      this._stream.on("finish", async () => {
        if (this._queue.isEmpty()) {
          this._stream = undefined;
          this._queue.empty();
        }

        await this.playNext();
      });

      return resolve();
    });
  }

  public async playNext(): Promise<void> {
    this._queue.changeSong(this._queue.currentIndex + 1);
    this._play(this._queue.currentSong);
  }

  public async playOnce(song: Song): Promise<void> {
    this._queue.empty();
    this.enqueue(song);
    this._play(song);
  }

  public resume(): void {
    this._stream && this._stream.resume();
  }

  public async search(
    query: string,
    streamingPlatform?: StreamingPlatform,
  ): Promise<Song> {
    switch (streamingPlatform) {
      case StreamingPlatform.Youtube:
      default:
        return YoutubeService.searchVideo(query);
    }
  }

  public stop(): void {
    this._stream.removeAllListeners();
    this._stream.destroy();
    this._stream = undefined;
    this._queue.empty();
  }

  public volumeDown(): void {
    if (!this._stream) {
      return;
    }

    const volume = clamp(this._stream.volume - 0.2, 0, 1);

    this._stream.setVolume(volume);

    this._textChannel.send("Volume down!");
  }

  public volumeUp(): void {
    if (!this._stream) {
      return;
    }

    const volume = clamp(this._stream.volume + 0.2, 0, 1);

    this._stream.setVolume(volume);

    this._textChannel.send("Volume up!");
  }

  private async _play(song: Song): Promise<void> {
    let audio: Readable;

    switch (song.source) {
      case StreamingPlatform.Youtube:
      default:
        audio = await YoutubeService.getVideoAudio(song.id);
        break;
    }

    this._stream = this._connection.play(audio);
  }
}

export default VoiceRadio;
