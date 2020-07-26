import React from "react";
import { Switch, Route } from "react-router-dom";
import Sidebar, { SidebarItem } from "../../components/sidebar/sidebar";
import { useRouteMatch } from "react-router-dom";
import Guilds from "./guilds/guilds";
import Playlists from "./playlists/playlists";
import Playlist from "./playlists/playlist/playlist";

const routes: ReadonlyArray<SidebarItem> = [
  {
    displayName: "Playlists",
    path: "/playlists",
  },
  {
    displayName: "Guilds",
    path: "/guilds",
  },
];

const Dashboard = () => {
  const match = useRouteMatch();

  return (
    <section className="flex flex-row w-full">
      <aside className="flex h-full">
        <Sidebar baseRoute={match.url} items={routes} />
      </aside>
      <section className="flex w-full p-8">
        <Switch>
          <Route path={`${match.url}/guilds`}>
            <Guilds />
          </Route>
          <Route exact path={`${match.url}/playlists`}>
            <Playlists />
          </Route>
          <Route path={`${match.url}/playlists/:playlistId`}>
            <Playlist />
          </Route>
        </Switch>
      </section>
    </section>
  );
};

export default Dashboard;
