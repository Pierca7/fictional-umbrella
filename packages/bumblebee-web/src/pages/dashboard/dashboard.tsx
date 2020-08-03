import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Sidebar, { SidebarItem } from "../../components/sidebar/sidebar";
import { useRouteMatch } from "react-router-dom";
import Guilds from "./guilds/guilds";
import Playlists from "./playlists/playlists";
import Playlist from "./playlists/playlist/playlist";
import { getUserDetails } from "../../services/user-service";

const routes: ReadonlyArray<SidebarItem> = [
  {
    displayName: "Playlists",
    path: "/playlists",
  },
  {
    displayName: "Guilds",
    path: "/guilds",
  }
];

const Dashboard = () => {
  const match = useRouteMatch();
  const [user, setUser] = useState();

  console.log(user)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("x-access-token") && params.has("x-access-token-expiration")) {
      const token = decodeURI(params.get("x-access-token") as string);
      const expirationTime = params.get("x-access-token-expiration") as string;

      window.location.search = "";

      localStorage.setItem("x-access-token", token);
      localStorage.setItem("x-access-token=expiration", expirationTime);
    }

    getUserDetails().then(user => setUser(user));
  }, [])

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
