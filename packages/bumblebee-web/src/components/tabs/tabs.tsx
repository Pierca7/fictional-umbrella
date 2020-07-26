import React, { useState } from "react";

export interface Tab {
  readonly header: string;
  readonly component: JSX.Element;
}

export interface TabsProps {
  readonly tabs: ReadonlyArray<Tab>;
}

const Tabs = (props: TabsProps) => {
  const { tabs } = props;
  const [activeTabId, setActiveTabId] = useState(0);
  const getTabStyle = (idx: number) => (activeTabId === idx ? "bg-soft-berry" : "bg-soft-winter");

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-2">
        {tabs.map((tab, idx) => (
          <div className={`flex px-2 py-4 cursor-pointer ${getTabStyle(idx)}`} onClick={() => setActiveTabId(idx)}>
            {tab.header}
          </div>
        ))}
      </div>
      {tabs[activeTabId].component}
    </div>
  );
};

export default Tabs;
