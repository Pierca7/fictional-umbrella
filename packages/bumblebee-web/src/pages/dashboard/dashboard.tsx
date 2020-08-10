import React, { useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Sidebar, { SidebarItem } from "../../components/sidebar/sidebar";
import { useRouteMatch } from "react-router-dom";
import Guilds from "./guilds/guilds";
import Playlists from "./playlists/playlists";
import Playlist from "./playlists/playlist/playlist";
import { useUserContext, UserActionTypes } from "../../state/userContext";
import { getUserDetails } from "../../services/user-service";

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

const isAuthenticated = () => !!(localStorage.getItem("x-access-token") && localStorage.getItem("x-access-token-expiration"));
const searchToken = () => {
  const params = new URLSearchParams(window.location.search);
  const hasToken = (params.has("x-access-token") && params.has("x-access-token-expiration")) || !!(localStorage.getItem("x-access-token") && localStorage.getItem("x-access-token-expiration"));

  if (hasToken) {
    const token = decodeURI(params.get("x-access-token") as string);
    const expirationTime = params.get("x-access-token-expiration") as string;

    window.location.search = "";

    localStorage.setItem("x-access-token", token);
    localStorage.setItem("x-access-token-expiration", expirationTime);
  }

  return hasToken;
};

const Dashboard = () => {
  const match = useRouteMatch();
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const { userState, setUserState } = useUserContext();

  useEffect(() => {
    if (!authenticated) {
      const hasToken = searchToken();

      if (hasToken) {
        setAuthenticated(true);
      } else {
        window.location.href = "http://localhost:5000/auth/login";
      }
    }

    if (authenticated && !userState.loading) {
      setUserState({
        type: UserActionTypes.FetchUserStarted,
      });

      getUserDetails().then(user =>
        setUserState({
          type: UserActionTypes.FetchUserFinished,
          data: user,
        })
      );
    }
  }, []);

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
