import React, { useContext } from "react";

export interface GridState {
    selectedContextMenu?: string;
    selectedRows: Array<string>;
}

export enum GridActionTypes {
    ChangeSelectedContextMenu = "ChangeSelectedContexMenu",
    SelectRow = "SelectRow",
    UnselectRow = "UnselectRow",
    SelectAllRows = "SelectAllRows",
    UnselectAllRows = "UnselectAllRows"
}

export type GridActions = {
    type: GridActionTypes.ChangeSelectedContextMenu;
    value?: string;
} |
{
    type: GridActionTypes.SelectRow;
    value?: string;
} |
{
    type: GridActionTypes.UnselectRow;
    value?: string;
} |
{
    type: GridActionTypes.SelectAllRows;
    value: Array<string>;
} |
{
    type: GridActionTypes.UnselectAllRows;
};

const initialState: GridState = {
    selectedRows: []
};

const initialContext: {
    gridState: GridState;
    setGridState: React.Dispatch<GridActions>;
} = {
    gridState: initialState,
    setGridState: () => { },
};

const Context = React.createContext(initialContext);

export const reducer = (state: GridState, action: GridActions): GridState => {
    switch (action.type) {
        default:
            return state;
        case GridActionTypes.ChangeSelectedContextMenu:
            return {
                ...state,
                selectedContextMenu: action.value
            };
        case GridActionTypes.SelectRow:
            state.selectedRows.push(action.value as string);

            return state;
        case GridActionTypes.UnselectRow:
            const items = state.selectedRows.filter(row => row !== action.value);
            state.selectedRows.length = 0;
            state.selectedRows.push(...items);

            return state;
        case GridActionTypes.SelectAllRows:
            state.selectedRows.length = 0;
            state.selectedRows.push(...(action.value as Array<string>))

            return state;
        case GridActionTypes.UnselectAllRows:
            state.selectedRows.length = 0;
            return state;
    }
}

export const GridContext = ({ children }: { children: JSX.Element }): JSX.Element => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const gridState = state;
    const setGridState = dispatch;

    return <Context.Provider value={{ gridState, setGridState }}>{children}</Context.Provider>;
}

export const useGridState = (): {
    gridState: GridState;
    setGridState: React.Dispatch<GridActions>;
} => useContext(Context);
