type StringDictionary = {
  [key: string]: string;
};

export interface SpotifyTrackOwner {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface SpotifyTrackImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyTrackAlbum {
  album_type: string;
  available_markets: Array<string>;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<SpotifyTrackImage>;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyTrackArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyTrack {
  added_at: string;
  added_by: SpotifyTrackOwner;
  is_local: boolean;
  track: {
    album: SpotifyTrackAlbum;
    artists: Array<SpotifyTrackArtist>;
    available_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  images: Array<StringDictionary>;
  name: string;
  public?: boolean;
  tracks: {
    href: string;
    items: Array<SpotifyTrack>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  type: string;
  uri: string;
}
