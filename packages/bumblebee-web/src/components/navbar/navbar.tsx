import React from "react";
import { Link } from "react-router-dom";

export interface NavbarItem {
  readonly displayName: string;
  readonly path: string;
}

export interface NavbarProps {
  readonly brandItem?: NavbarItem;
  readonly items: ReadonlyArray<NavbarItem>;
}

const Navbar = (props: NavbarProps & { children?: React.ReactNode }) => {
  const { items, brandItem, children } = props;

  return (
    <nav className="flex w-full h-full p-4 bg-soft-berry">
      <ul className="flex flex-row w-full">
        <div className="flex flex-row w-full justify-start">
          {brandItem && (
            <li key={brandItem.path} className="flex justify-center self-center hover:text-winter-grey">
              <Link to={brandItem.path}>{brandItem.displayName}</Link>
            </li>
          )}
        </div>
        <div className="flex flex-row w-full justify-end">
          {items.map(item => (
            <li key={item.path} className="flex ml-4 justify-center self-center hover:text-winter-grey">
              <Link to={item.path}>{item.displayName}</Link>
            </li>
          ))}
        </div>
        {
          children
        }
      </ul>
    </nav>
  );
};

export default Navbar;
