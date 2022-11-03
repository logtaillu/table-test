import { ColumnGroupType, ColumnsType, ColumnType } from "rc-table/lib/interface";
import { ICellKey } from "../tableDriver/ITableDriver";
type IColumn = ColumnGroupType<any> | ColumnType<any>;
type IMapColumnCallback = (col: IColumn, cell: ICellKey, isLeaf: boolean) => Partial<IColumn>;
/**
 * 参数合并，主要处理函数
 * @param col 
 * @param target 
 * @returns 
 */
export function mergeConfig(col, target, mergeObject = false) {
    let res = { ...col };
    Object.keys(target).map(key => {
        const cur = target[key];
        if (typeof (cur) === "function" && res[key]) {
            const orifunc = res[key];
            res[key] = function (...args) {
                const originValue = orifunc(...args);
                return { ...originValue, ...cur(...args) };
            }
        } else if (mergeObject && res[key] && typeof (cur) === "object" && !Array.isArray(cur)) {
            res[key] = mergeConfig(res[key], cur, true);
        } else {
            res[key] = cur;
        }
    })
    return res;
}

/**
 * 递归遍历columns
 * @param columns 列数组
 * @param handle 处理函数
 * @param row 当前行数
 * @param startCol 起始列号
 */
function recursionMapColumns(columns: ColumnsType<any>, handle: IMapColumnCallback, row: number, startCol: number) {
    return (columns || []).map((col, index) => {
        const cell: ICellKey = { type: "header", row, col: startCol + index };
        if ('children' in col && col.children.length) {
            const children = recursionMapColumns(col.children, handle, row + 1, startCol + index);
            return { ...mergeConfig(col, handle(col, cell, false)), children };
        } else {
            return mergeConfig(col, handle(col, cell, true));
        }
    });
}

/**
 * 遍历columns并处理，只处理最内部实际格子
 * @param columns 列
 * 
 */
export function mapColumn(columns: ColumnsType<any>, handle: IMapColumnCallback) {
    const baseColumns = columns || [];
    const start = Math.max(baseColumns.findIndex(s => (s as any).except !== true), 0);
    const handleCols = baseColumns.slice(start);
    const exceptedCols = baseColumns.slice(0, start);
    return exceptedCols.concat(recursionMapColumns(handleCols, handle, 0, 0));
}