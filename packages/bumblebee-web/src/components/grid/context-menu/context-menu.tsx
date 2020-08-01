import React, { useState } from 'react'
import { useGridState } from '../state';

export interface ContextMenuItem<T> {
    readonly text: string;
    readonly icon?: JSX.Element;
    readonly onClick: (item: T) => void;
}

export interface ContextMenuProps<T> {
    readonly item: T;
    readonly menuItems: ReadonlyArray<ContextMenuItem<T>>;
    readonly expanded?: boolean;
}

function ContextMenu<T>(props: ContextMenuProps<T>){
    const { menuItems, item } = props;
    const gridState = useGridState();

    return (
        <div className="relative inline-block text-left">
            <div>
                <span className="rounded-md shadow-sm">
                    <button onClick={() => {}} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded={true}>
                        ...
                    </button>
                </span>
            </div>
            {
                {} && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg z-20">
                        <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {
                                menuItems.map(menuItem => (
                                    <button onClick={() => menuItem.onClick(item)} className="flex items-start space-x-3 block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
                                        {
                                            menuItem.icon && (
                                                <span className="flex-shrink-0 h-6 w-6 rounded-full">
                                                    {menuItem.icon}
                                                </span>
                                            )
                                        }
                                        <span className="block truncate">
                                            {menuItem.text}
                                        </span>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ContextMenu;
