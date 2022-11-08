import { ITableCacheConfig } from "./ITableDriver";

export const defaultCssVars = {
    "--cell-f-size": 12, // 因为scale计算，这里用number
    "--cell-f-family": "Microsoft YaHei",
    "--cell-f-color": "#666",
    "--cell-align-h": "center",
    "--cell-align-v": "middle",
    "--cell-bg": "transparent",
    "--cell-f-weight": "normal",
    "--cell-f-style": "normal",
    "--cell-decoration": "none",
    "--cell-b-width-t": "1px",
    "--cell-b-style-t": "solid",
    "--cell-b-color-t": "cornflowerblue",
    "--cell-b-width-l": "1px",
    "--cell-b-style-l": "solid",
    "--cell-b-color-l": "cornflowerblue",
    "--cell-b-width-r": "1px",
    "--cell-b-style-r": "solid",
    "--cell-b-color-r": "cornflowerblue",
    "--cell-b-width-b": "1px",
    "--cell-b-style-b": "solid",
    "--cell-b-color-b": "cornflowerblue",
};
export const getDefaultConfig: () => ITableCacheConfig = () => ({
    all: {
        row: { autoHeight: true, rowHeight: 40 },
        col: { colWidth: 100 },
        cell: {
            cssvars: {...defaultCssVars}
        }
    }
});