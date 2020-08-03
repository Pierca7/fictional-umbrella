import Playlist, { IPlaylist, Song } from "../schemas/Playlist";
import DataAccess from "./data-access";
import { PlaylistDTO } from "../data-objects/playlist";

abstract class PlaylistManager extends DataAccess<PlaylistDTO, IPlaylist> {
  public static async create(data: PlaylistDTO, userId: string): Promise<IPlaylist> {
    const songs = data.songs.map(song => new Song(song));
    const playlist = new Playlist({ ...data, songs: songs, owner: userId });

    await playlist.save();

    return playlist;
  }

  public static async deleteById(id: string, userId: string): Promise<void> {
    Playlist.remove((item: IPlaylist) => item && (item._id === id && item.owner === userId));
  }

  public static async deleteWhere(condition: (value: IPlaylist) => boolean, userId: string): Promise<void> {
    await Playlist.remove((item: IPlaylist) => item && (condition(item) && item.owner === userId));
  }

  public static async getAll(userId: string): Promise<IPlaylist[]> {
    return Playlist.find((item: IPlaylist) => item && item.owner === userId);
  }

  public static async getById(id: string, userId: string): Promise<IPlaylist> {
    return Playlist.findOne((item: IPlaylist) => item && (item._id === id && item.owner === userId));
  }

  public static async getWhere(condition: (value: IPlaylist) => boolean, userId: string) {
    return Playlist.find((item: IPlaylist) => item && (condition(item) && item.owner === userId));
  }

  public static async updateById(id: string, data: PlaylistDTO, userId: string): Promise<IPlaylist> {
    return new Promise(async (resolve, reject) => {
      const playlist = await Playlist.findOne((item: IPlaylist) => item && (item._id === id && item.owner === userId));

      if (!playlist) {
        reject(new Error("There is no playlist matching such ID."));
      }

      playlist.name = data.name;
      playlist.length = data.length;
      playlist.url = data.url;
      playlist.songs = data.songs.map(song => new Song(song));

      await playlist.save();

      resolve(playlist);
    });
  }
}

export default PlaylistManager;
