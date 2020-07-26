import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ComponentSize } from "../../models/shared-props";
import { getWidth } from "../../utils/size";

export interface SidebarItem {
  readonly displayName: string;
  readonly path: string;
}

export interface SidebarProps {
  readonly baseRoute?: string;
  readonly size?: ComponentSize;
  readonly items: ReadonlyArray<SidebarItem>;
}

const Sidebar = (props: SidebarProps) => {
  const { items, size, baseRoute } = props;
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? getWidth(ComponentSize.Small) : getWidth(size);

  return (
    <nav className={`flex flex-col h-full p-4 bg-soft-berry ${width}`}>
      <div className="flex pb-4 font-black hover:text-winter-grey cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? ">>" : "<<"}
      </div>
      {!collapsed && (
        <ul className="flex flex-col">
          {items.map(item => {
            const path = baseRoute + item.path;

            return (
              <li key={path} className="flex pb-4 hover:text-winter-grey ">
                <Link to={path}>{item.displayName}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

export default Sidebar;
