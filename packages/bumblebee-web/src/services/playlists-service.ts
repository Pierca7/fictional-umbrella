import { Playlist } from "../models/playlist";
import axios from "axios";

export const getPlaylistsByUser = (): Promise<ReadonlyArray<Playlist>> => {
  return axios
    .get("http://localhost:5000/playlists", {
      withCredentials: true,
    })
    .then(response => response.data);
};

export const getPlaylistById = (id: string): Promise<Playlist> => {
  return axios
  .get(`http://localhost:5000/playlists/${id}`, {
    withCredentials: true,
  })
  .then(response => response.data);
};
