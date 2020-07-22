import SpotifyService from "../services/spotify/spotify-service";
import YoutubeService from "../services/youtube/youtube-service";

export enum Providers {
  Youtube = "youtube",
  Spotify = "spotify",
}

export interface SongDTO {
  length: number;
  name: string;
  originUrl: string;
  thumbnail: string;
  url: string;
}

export interface PlaylistDTO {
  length: number;
  name: string;
  owner: string;
  provider: Providers;
  thumbnail: string;
  songs: Array<SongDTO>;
  url: string;
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
    const { length, name, owner, provider, songs, url, thumbnail } = data;

    this.length = length;
    this.name = name;
    this.owner = owner;
    this.provider = provider;
    this.songs = songs;
    this.url = url;
    this.thumbnail = thumbnail;
  }

  public static async createFromSpotify(url: string, owner: string, name?: string): Promise<PlaylistDTO> {
    const playlistId = url.split("/").pop();
    const playlist = await SpotifyService.getPlaylist(playlistId);

    const songPromises = playlist.tracks.items.map(async item => {
      const artistNames = item.track.artists.map(artist => artist.name).join(" ");
      const query = `${item.track.name} ${artistNames}`;

      const video = await YoutubeService.searchVideo(query);

      return {
        ...video[0],
        originArtists: item.track.artists,
        originThumbnail: item.track.album.images[0].url,
      };
    });

    const possibleSongs = await Promise.all(songPromises);

    // Take the first of the videos returned by Youtube and map them to the common interface
    const songs = possibleSongs.map(
      video =>
        ({
          length: parseLength(video.duration),
          name: video.title,
          originUrl: url,
          thumbnail: video.originThumbnail,
          url: video.link,
        } as SongDTO)
    );

    return new PlaylistDTO({
      length: playlist.tracks.total,
      name: name || playlist.name,
      owner: owner,
      provider: Providers.Spotify,
      songs: songs,
      url: playlist.uri,
      thumbnail: playlist.images[0].url,
    });
  }
}
