import { ITableCacheConfig } from "./ITableDriver";

export const defaultCssVars = {
    "--cell-font-size": 12,
    "--cell-font-family": "Microsoft YaHei",
    "--cell-font-color": "#666",
    "--cell-text-align": "center",
    "--cell-vertical-align": "middle",
    "--cell-background": "transparent",
    "--cell-font-weight": "normal",
    "--cell-font-style": "normal",
    "--cell-text-decoration": "none"
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