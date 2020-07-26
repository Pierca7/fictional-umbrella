import React from "react";

export interface ActionButtonProps {
  readonly icon?: JSX.Element;
  readonly label: string;
}

const ActionButton = (props: ActionButtonProps) => {
  const { label, icon } = props;

  return (
    <button className="flex flex-row p-4 border border-soft-berry hover:bg-soft-berry">
      {icon && <div className="pr-2">{icon}</div>}
      <div>{label}</div>
    </button>
  );
};

export default ActionButton;
