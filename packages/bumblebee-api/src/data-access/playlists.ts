import Playlist, { IPlaylist, Song } from "../schemas/Playlist";
import DataAccess from "./data-access";
import { PlaylistDTO } from "../data-objects/playlist";

abstract class PlaylistManager extends DataAccess<PlaylistDTO, IPlaylist> {
  public static async create(data: PlaylistDTO): Promise<IPlaylist> {
    const songs = data.songs.map(song => new Song(song));
    const playlist = new Playlist({ ...data, songs: songs });

    await playlist.save();

    return playlist;
  }

  public static async deleteById(id: string): Promise<void> {
    await Playlist.findByIdAndRemove(id);
  }

  public static async deleteWhere(condition: (value: IPlaylist) => boolean): Promise<void> {
    await Playlist.remove(condition);
  }

  public static async getAll(): Promise<IPlaylist[]> {
    return Playlist.find();
  }

  public static async getById(id: string): Promise<IPlaylist> {
    return Playlist.findById(id);
  }

  public static async getWhere(condition: (value: IPlaylist) => boolean) {
    return Playlist.find(condition);
  }

  public static async updateById(id: string, data: PlaylistDTO): Promise<IPlaylist> {
    return new Promise(async (resolve, reject) => {
      const playlist = await Playlist.findById(id);

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
