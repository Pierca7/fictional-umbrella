/* eslint-disable no-console */
import { spotifyTokenUrl, spotifyApiUrl } from "configuration/constants";
import axios from "axios";

export interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

abstract class SpotifyService {
  private static _token: SpotifyToken;
  private static _refreshing: boolean;

  public static async getPlaylist(id: string): Promise<any> {
    if (!this._token || !this._token.access_token) {
      await this._getToken();
    }

    return axios
      .get(`${spotifyApiUrl}/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${this._token.access_token}`,
        },
      })
      .then(response => response.data);
  }

  private static _getToken(): Promise<void> {
    const data = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const buffer = new Buffer(data);
    const authorizationHeader = buffer.toString("base64");

    return axios
      .post(spotifyTokenUrl, "grant_type=client_credentials", {
        headers: {
          Authorization: `Basic ${authorizationHeader}`,
        },
      })
      .then(response => {
        this._token = response.data;

        if (!this._refreshing) {
          this._setTokenRefresh();
          this._refreshing = true;
        }
      });
  }

  private static _setTokenRefresh() {
    setInterval(() => this._getToken(), this._token.expires_in - 10);
  }
}

export default SpotifyService;
