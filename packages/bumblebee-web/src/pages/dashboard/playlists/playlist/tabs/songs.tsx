import React from 'react'
import Grid, { Column, GridColumnType, ImageColumn, TextColumn, LinkColumn } from '../../../../../components/grid/grid'
import { Song } from '../../../../../models/playlist'
import ActionButton from '../../../../../components/action-button/action-button'
import { ContextMenuItem } from '../../../../../components/grid/context-menu/context-menu'

export interface SongGridItem extends Song {
    readonly key: string;
}

const columns: ReadonlyArray<Column<SongGridItem>> = [
    {
        header: "Title",
        type: GridColumnType.Image,
        width: 20,
        getData: item => ({
            alt: `Cover for ${item.name}`,
            source: item.thumbnail,
            text: item.name
        })
    } as ImageColumn<SongGridItem>,
    {
        header: "Length",
        type: GridColumnType.Text,
        width: 10,
        getData: item => {
            const minutes = Math.floor(item.length / 60);
            const seconds = item.length % 60;
      
            return {
                text: seconds > 9 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`
            }
        }
    } as TextColumn<SongGridItem>,
    {
        header: "Origin URL",
        type: GridColumnType.Link,
        width: 15,
        getData: item => ({
            displayText: "Spotify",
            url: item.url
        })
    } as LinkColumn<SongGridItem>,
    {
        header: "URL",
        type: GridColumnType.Link,
        width: 20,
        getData: item => ({
            displayText: "Find on YouTube",
            url: item.url
        })
    } as LinkColumn<SongGridItem>
]

const contextMenuItems: ReadonlyArray<ContextMenuItem<SongGridItem>> = [
    {
        icon: (<div>X</div>),
        text: "Remove",
        onClick: () => { }
    }
]

export interface SongsProps {
    readonly songs: ReadonlyArray<Song>
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
            <Grid columns={columns} items={songs.map(song => ({ ...song, key: song.id }))} contextMenuItems={contextMenuItems} />
        </div>
    )
}

export default Songs;
