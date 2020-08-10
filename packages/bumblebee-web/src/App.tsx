import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar, { NavbarItem } from "./components/navbar/navbar";
import Home from "./pages/home/home";
import Docs from "./pages/docs/docs";
import Dashboard from "./pages/dashboard/dashboard";

import "./App.scss";
import { UserContext } from "./state/userContext";

const homeRoute: NavbarItem = {
  displayName: "BUMBLEBEE",
  path: "/",
};

const routes: ReadonlyArray<NavbarItem> = [
  {
    displayName: "Docs",
    path: "/docs",
  },
  {
    displayName: "Dashboard",
    path: "/dashboard",
  },
  {
    displayName: "Log in",
    path: "http://localhost:5000/auth/login",
    externalLink: true,
  },
];

function App() {
  return (
    <div className="flex flex-col h-screen w-screen text-soft-winter-grey">
      <Router>
        <header className="flex h-16">
          <Navbar brandItem={homeRoute} items={routes} />
        </header>
        <div className="flex flex-1 bg-berry">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/docs">
              <Docs />
            </Route>
            <Route className="h-full flex" path="/dashboard">
              <UserContext>
                <Dashboard />
              </UserContext>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
