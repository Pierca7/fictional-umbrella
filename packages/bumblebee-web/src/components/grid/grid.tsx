import React from "react";
import ContextMenu, { ContextMenuItem } from "./context-menu/context-menu";
import { GridContext, useGridState } from "./state";

export interface GridItem {
  readonly key: string;
}

export interface GridProps<T extends GridItem> {
  readonly columns: ReadonlyArray<Column<T>>;
  readonly items: ReadonlyArray<T>;
  readonly contextMenuItems: ReadonlyArray<ContextMenuItem<T>>;
}

export interface Column<T extends GridItem> {
  readonly type: GridColumnType;
  readonly header: string;
  readonly width: number;
  readonly getData: (item: T) => ImageCellProps | TextCellProps | LinkCellProps;
}

export interface ImageColumn<T extends GridItem> extends Column<T> {
  readonly type: GridColumnType.Image;
  readonly source: string;
  readonly getData: (item: T) => ImageCellProps;
}

export interface TextColumn<T extends GridItem> extends Column<T> {
  readonly type: GridColumnType.Text;
  readonly getData: (item: T) => TextCellProps;
}

export interface LinkColumn<T extends GridItem> extends Column<T> {
  readonly type: GridColumnType.Link;
  readonly getData: (item: T) => LinkCellProps;
}

export interface ImageCellProps {
  readonly source: string;
  readonly alt: string;
  readonly text?: string;
}

export interface TextCellProps {
  readonly text: string;
}

export interface LinkCellProps {
  readonly displayText: string;
  readonly url: string;
}

export enum GridColumnType {
  Image,
  Text,
  Link,
  Custom,
}

function ImageCell(props: ImageCellProps) {
  const { source, alt, text } = props;

  return (
    <div className="flex items-start">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <img className="h-10 w-10" src={source} alt={alt} />
        </div>
        {text && (
          <div className="ml-4">
            <div className="text-sm leading-5 font-medium text-gray-900">{text}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function LinkCell(props: LinkCellProps) {
  const { displayText, url } = props;

  return (
    <a href={url} className="text-indigo-600 hover:text-indigo-900">
      {displayText}
    </a>
  );
}

function TextCell(props: TextCellProps) {
  const { text } = props;

  return <div className="text-sm leading-5 text-gray-900">{text}</div>;
}

function mapItemToRow<T extends GridItem>(item: T, columns: ReadonlyArray<Column<T>>) {
  return columns.map(column => {
    let element: JSX.Element;

    switch (column.type) {
      case GridColumnType.Image:
        element = <ImageCell {...(column.getData(item) as ImageCellProps)} />;
        break;

      case GridColumnType.Text:
        element = <TextCell {...(column.getData(item) as TextCellProps)} />;
        break;
      case GridColumnType.Link:
        element = <LinkCell {...(column.getData(item) as LinkCellProps)} />;
        break;
      default:
        element = <div></div>;
        break;
    }

    return (
      <div key={`${item.key}-${column.header.toLowerCase()}`} style={{ width: `${column.width}%` }} className="flex px-6 py-4 whitespace-no-wrap">
        {element}
      </div>
    );
  });
}

function Grid<T extends GridItem>(props: GridProps<T> & { children?: React.ReactNode }): React.ReactElement {
  const { columns, items, contextMenuItems } = props;

  return (
    <GridContext>
      <div className="flex flex-col">
        <div className="-my-2 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block min-w-full shadow sm:rounded-lg border-b border-gray-200">
            <div className="min-w-full flex flex-col">
              <div className="flex flex-row border-b border-gray-200 bg-gray-50 ">
                {columns.map(column => (
                  <div style={{ width: `${column.width}%` }} className="flex px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {column.header}
                  </div>
                ))}
              </div>
              <div className="flex flex-col bg-white">
                {items.map(item => (
                  <div key={item.key} className="flex flex-row bg-white border-b border-gray-200 bg-gray-50 ">
                    {mapItemToRow<T>(item, columns)}
                    <div key={`${item.key}-menu`} className="flex w-1/12 px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider ml-auto">
                      <ContextMenu menuItems={contextMenuItems} item={item} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridContext>
  );
}

export default Grid;
