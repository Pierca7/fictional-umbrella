import React, { useState, useEffect } from "react";
import { getPlaylistsByUser } from "../../../services/playlists-service";
import { Playlist } from "../../../models/playlist";
import Card from "../../../components/card/card";
import ActionButton from "../../../components/action-button/action-button";
import { useHistory, useRouteMatch } from "react-router-dom";

const Playlists = () => {
  const [playlists, setPlaylists] = useState<ReadonlyArray<Playlist>>([]);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    getPlaylistsByUser()
      .then(playlists => setPlaylists(playlists))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-full">
      <h1>Playlists</h1>
      <div className="flex flex-row mx-8 my-4">
        <ActionButton icon={<div>+</div>} label="Add" />
      </div>
      <div className="flex flex-row flex-wrap m-4">
        {playlists.map((playlist: Playlist) => {
          const { _id, name, owner, thumbnail } = playlist;

          return (
            <div key={_id} className="flex m-4 sm:12/12 md:w-6/12 lg:w-4/12 xl:w-2/12">
              <Card owner={owner} title={name} image={thumbnail} onClick={() => history.push(`${match.url}/${_id}`)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playlists;
