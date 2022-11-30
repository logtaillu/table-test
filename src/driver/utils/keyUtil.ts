/** key值转换函数 */

import { IBaseValueType, ICellKey, ICellType, IColKey, IRowKey } from "../../interfaces/IDriverContent";

/**
 * string类型cell key
 * @param cell 单元格
 * @returns key
 */
export function getCellKey(cell: ICellKey) {
    return [cell.type, cell.row, cell.col].join("-");
}
/**
 * string类型row key
 * @param row 行
 * @returns key
 */
export function getRowKey(row: IRowKey) {
    return [row.type, row.row].join("-");
}
/**
 * string类型col key
 * @param col 列
 * @returns key
 */
export function getColKey(col: IColKey) {
    return col.col + "";
}

/**
 * 从cell获取各种类型的key
 * @param cell 单元格
 * @param type 需要获取的key类型
 * @returns string 
 */
export function getCellTypeKey(cell: ICellKey, type: IBaseValueType) {
    if (type === "cell") {
        return getCellKey(cell);
    } else if (type === "row") {
        return getRowKey({ type: cell.type, row: cell.row });
    } else {
        return getColKey({ col: cell.col });
    }
}

/**
 * 从string转换成obj的cell key
 * @param keystr key字符串
 */
export function getCellKeyObj(keystr: string): ICellKey {
    const [type, row, col] = keystr.split("-");
    return { type: type as ICellType, row, col };
}

/**
 * 从string转换成obj的row key
 * @param keystr key字符串
 */
export function getRowKeyObj(keystr: string): IRowKey {
    const [type, index] = keystr.split("-");
    return { type: type as ICellType, row: index };
}

export function getColKeyObj(keystr: string): IColKey {
    return { col: keystr };
}