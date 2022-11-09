import { ITableCacheConfig } from "./ITableDriver";
const bordeColor = "cornflowerblue";
const borderWidth = "1px";
const borderStyle = "solid";
const baseCssVars = {
    "--cell-f-size": 12, // 因为scale计算，这里用number
    "--cell-f-family": "Microsoft YaHei",
    "--cell-f-color": "#666",
    "--cell-align-h": "center",
    "--cell-align-v": "middle",
    "--cell-bg": "transparent",
    "--cell-f-weight": "normal",
    "--cell-f-style": "normal",
    "--cell-decoration": "none",
};
export const defaultCssVars = {
    ...baseCssVars,
    "--cell-b-width-t": borderWidth,
    "--cell-b-style-t": borderStyle,
    "--cell-b-color-t": bordeColor,
    "--cell-b-width-l": borderWidth,
    "--cell-b-style-l": borderStyle,
    "--cell-b-color-l": bordeColor,
    "--cell-b-width-r": borderWidth,
    "--cell-b-style-r": borderStyle,
    "--cell-b-color-r": bordeColor,
    "--cell-b-width-b": borderWidth,
    "--cell-b-style-b": borderStyle,
    "--cell-b-color-b": bordeColor,
};
export const getDefaultConfig: () => ITableCacheConfig = () => ({
    all: {
        row: { autoHeight: true, rowHeight: 40 },
        col: { colWidth: 100 },
        cell: {
            cssvars: { ...baseCssVars },
            bordeType: "all",
            borderColor: bordeColor,
            borderStyle: borderStyle,
            borderWidth: borderWidth
        }
    }
});