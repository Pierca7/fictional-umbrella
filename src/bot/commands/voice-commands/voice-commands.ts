import { VoiceConnection, StreamDispatcher } from "discord.js";
import { Readable } from "stream";
import YoutubeService from "services/youtube-service";
import Song from "models/song";

export enum StreamingPlatform {
  Youtube,
  Spotify,
}

class VoiceCommandsManager {
  private _connection: VoiceConnection;
  private _stream: StreamDispatcher;

  constructor(connection: VoiceConnection) {
    this._connection = connection;
  }

  public pause(): void {
    this._stream && this._stream.pause();
  }

  public async play(song: Song): Promise<StreamDispatcher> {
    let audio: Readable;

    switch (song.source) {
      case StreamingPlatform.Youtube:
      default:
        audio = await YoutubeService.getVideoAudio(song.id);
        break;
    }

    this._stream = this._connection.play(audio);

    return this._stream;
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

  public volumeDown() {
    this._stream && this._stream.setVolume(this._stream.volume - 0.2);
  }

  public volumeUp() {
    this._stream && this._stream.setVolume(this._stream.volume + 0.2);
  }
}

export default VoiceCommandsManager;
