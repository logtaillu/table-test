import { ICellKey, IRowKey, IColKey, IValueType, ICellType } from "./ITableDriver";

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
    return [row.type, row.index].join("-");
}
/**
 * string类型col key
 * @param col 列
 * @returns key
 */
export function getColKey(col: IColKey) {
    return col.index + "";
}

/**
 * 从cell获取各种类型的key
 * @param cell 单元格
 * @param type 需要获取的key类型
 * @returns string 
 */
export function getCellTypeKey(cell: ICellKey, type: IValueType) {
    if (type === "cell") {
        return getCellKey(cell);
    } else if (type === "row") {
        return getRowKey({ type: cell.type, index: cell.row });
    } else {
        return getColKey({ index: cell.col });
    }
}
/**
 * 从string转换成obj的cell key
 * @param keystr key字符串
 */
export function getCellKeyObj(keystr: string): ICellKey {
    const [type, row, col] = keystr.split("-");
    return { type: type as ICellType, row: Number(row), col: Number(col) };
}

/**
 * 从string转换成obj的row key
 * @param keystr key字符串
 */
export function getRowKeyObj(keystr: string): IRowKey {
    const [type, index] = keystr.split("-");
    return { type: type as ICellType, index: Number(index) };
}