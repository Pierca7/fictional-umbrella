import { Playlist } from "../models/playlist";
import axios from "axios";

export const getPlaylistsByUser = (): Promise<ReadonlyArray<Playlist>> => {
  return axios
    .get("http://localhost:5000/playlists", {
      headers: {
        "x-access-token": localStorage.getItem("x-access-token"),
      },
    })
    .then(response => response.data)
    .catch(() => []);
};

export const getPlaylistById = (id: string): Promise<Playlist> => {
  return axios
    .get(`http://localhost:5000/playlists/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("x-access-token"),
      },
    })
    .then(response => response.data)
    .catch(() => {});
};
