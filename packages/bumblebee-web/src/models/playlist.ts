export enum Providers {
  Youtube = "youtube",
  Spotify = "spotify",
}

export interface Song {
  readonly length: number;
  readonly originUrl: string;
  name: string;
  thumbnail: string;
  url: string;
}

export interface Source {
  readonly provider: Providers;
  readonly url: string;
}

export interface NewPlaylist {
  readonly length: number;
  readonly owner: string;
  readonly sources: Array<Source>;
  readonly lastUpdated: string;
  readonly songs: Array<Song>;
  name: string;
  thumbnail: string;
}

export interface Playlist extends NewPlaylist {
  readonly id: string;
}
