/** key值转换函数 */
import { ICellKey, IRowKey, IColKey, IBaseValueType, ICellType } from "../interfaces/IGlobalType";

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

/**
 * 从3种类型的key string转化成cell obj
 */
export function getCellTypeObj(keystr: string): ICellKey {
    const ary = keystr.split("-");
    const basecell: ICellKey = { col: "0", row: "0", type: "body" };
    if (ary.length == 0) {
        return basecell;
    } else if (ary.length === 1) {
        return { ...basecell, ...getColKeyObj(keystr) };
    } else if (ary.length === 2) {
        return { ...basecell, ...getRowKeyObj(keystr) };
    } else {
        return getCellKeyObj(keystr);
    }
}