import React, { useState, useEffect } from "react";
import { Playlist as IPlaylist } from "../../../../models/playlist";
import ActionButton from "../../../../components/action-button/action-button";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../../../../services/playlists-service";
import Tabs, { Tab } from "../../../../components/tabs/tabs";
import Songs from "./tabs/songs";

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState<IPlaylist>();

  useEffect(() => {
    getPlaylistById(playlistId)
      .then(playlist => setPlaylist(playlist))
      .catch(err => console.error(err));
  }, [playlistId]);

  const tabs: ReadonlyArray<Tab> = [
    {
      header: "Songs",
      component: <Songs songs={(playlist && playlist.songs) || []} />,
    },
    {
      header: "Sources",
      component: <div>UwU2</div>,
    },
  ];

  return (
    <div className="h-full w-full">
      <h1 className="pb-8">{playlist?.name}</h1>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Playlist;
