import React from "react";
import { Link } from "react-router-dom";

const logout = () => {
  localStorage.removeItem("x-access-token")
  localStorage.removeItem("x-access-token-expiration")

  window.location.href = "http://localhost:3000";
};

const login = () => {
  window.location.href = "http://localhost:5000/auth/login";
};

const Navbar = () => {
  return (
    <nav className="flex w-full h-full p-4 bg-soft-berry">
      <ul className="flex flex-row w-full">
        <div className="flex flex-row w-full justify-start">
          <li className="flex justify-center self-center hover:text-winter-grey">
            <Link to="/">BUMBLEBEE</Link>
          </li>
        </div>
        <div className="flex flex-row w-full justify-end">
          <li className="flex ml-4 justify-center self-center hover:text-winter-grey">
            <Link to="/docs">Docs</Link>
          </li>
          <li className="flex ml-4 justify-center self-center hover:text-winter-grey">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="flex ml-4 justify-center self-center hover:text-winter-grey">
            {
              false ? (
                <a onClick={logout}>Log out</a>
              ) : (
                <a onClick={login}>Log in</a>
              )
            }
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
