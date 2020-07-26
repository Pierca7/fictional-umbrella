import React from "react";
import Grid, { Column, GridColumnType, ImageColumn, TextColumn, LinkColumn } from "../../../../../components/grid/grid";
import { Song } from "../../../../../models/playlist";
import ActionButton from "../../../../../components/action-button/action-button";

const columns: ReadonlyArray<Column<Song>> = [
  {
    header: "Title",
    type: GridColumnType.Image,
    getData: item => ({
      alt: `Cover for ${item.name}`,
      source: item.thumbnail,
      text: item.name,
    }),
  } as ImageColumn<Song>,
  {
    header: "Length",
    type: GridColumnType.Text,
    getData: item => ({
      text: item.length.toString(),
    }),
  } as TextColumn<Song>,
  {
    header: "URL",
    type: GridColumnType.Link,
    getData: item => ({
      displayText: "Find on YouTube",
      url: item.url,
    }),
  } as LinkColumn<Song>,
];

export interface SongsProps {
  readonly songs: ReadonlyArray<Song>;
}

const Songs = (props: SongsProps) => {
  const { songs } = props;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-2">
        <div className="flex mr-2">
          <ActionButton icon={<div>+</div>} label="Add" />
        </div>
        <div className="flex mr-2">
          <ActionButton icon={<div>X</div>} label="Remove" />
        </div>
      </div>
      <Grid columns={columns} items={songs} />
    </div>
  );
};

export default Songs;
