import React from "react";

export interface CardProps {
  readonly image?: string;
  readonly title: string;
  readonly owner: string;
  readonly onClick: () => void;
}

const Card = (props: CardProps) => {
  const { owner, title, image, onClick } = props;
  const imageUrl = image || "https://homepages.cae.wisc.edu/~ece533/images/fruits.png";

  return (
    <div className="flex flex-col p-4 border border-soft-berry hover:bg-soft-berry cursor-pointer" onClick={onClick}>
      <img className="object-cover" src={imageUrl}></img>
      <div className="flex flex-col">
        <h5 className="flex mt-4 mb-2 self-start text-lg font-bold">{title}</h5>
        <h6 className="flex self-start text-lg">{owner}</h6>
      </div>
    </div>
  );
};

export default Card;
