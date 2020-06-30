import SpotifyService from "../services/spotify/spotify-service";
import YoutubeService from "../services/youtube/youtube-service";

export enum Providers {
  Youtube = "youtube",
  Spotify = "spotify",
}

export interface SongDTO {
  name: string;
  url: string;
  length: number;
}

export interface PlaylistDTO {
  name: string;
  provider: Providers;
  url: string;
  songs: Array<SongDTO>;
  length: number;
  owner: string;
}

const parseLength = (string: string): number => {
  if (!string) {
    return Infinity;
  }

  const parsedLength = string.split(":");

  if (parsedLength.length < 2) {
    return Infinity;
  }

  return parseInt(parsedLength[0], 10) * 60 + parseInt(parsedLength[1], 10);
};

export class PlaylistDTO implements PlaylistDTO {
  protected constructor(data: PlaylistDTO) {
    const { length, name, owner, provider, songs, url } = data;

    this.length = length;
    this.name = name;
    this.owner = owner;
    this.provider = provider;
    this.songs = songs;
    this.url = url;
  }

  public static async createFromSpotify(
    url: string,
    owner: string,
  ): Promise<PlaylistDTO> {
    const playlistId = url.split("/").pop();
    const playlist = await SpotifyService.getPlaylist(playlistId);

    const songPromises = playlist.tracks.items.map(item => {
      const artistNames = item.track.artists
        .map(artist => artist.name)
        .join(" ");
      const query = `${item.track.name} ${artistNames}`;

      return YoutubeService.searchVideo(query);
    });

    const possibleSongs = await Promise.all(songPromises);

    // Take the first of the videos returned by Youtube and map them to the common interface
    const songs = possibleSongs
      .map(candidates => candidates[0])
      .map(
        video =>
          ({
            name: video.title,
            url: video.link,
            length: parseLength(video.duration),
          } as SongDTO),
      );

    return new PlaylistDTO({
      name: playlist.name,
      owner: owner,
      provider: Providers.Spotify,
      length: playlist.tracks.total,
      songs: songs,
      url: playlist.uri,
    });
  }
}
