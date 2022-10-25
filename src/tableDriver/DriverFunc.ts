/**
 * 不涉及内部状态的辅助函数
 */
import { ICellKey, ICellRange, IColKey, IRangeRelation, IRowKey, IValueType } from "./ITableDriver";


/**
 * 对比，0等于，1大于，-1小于
 * @param a 单元格
 * @param b 单元格
 * @param type 对比类型，row行col列
 * @returns 对比结果
 */
export function compareCell(a: ICellKey, b: ICellKey, type: "row" | "col"): number {
    if (type === "col") {
        return a.col === b.col ? 0 : a.col > b.col ? 1 : -1;
    } else {
        if (a.type === b.type) {
            return a.row === b.row ? 0 : a.row > b.row ? 1 : -1;
        } else {
            return a.type === "header" ? -1 : 1;
        }
    }
}
/**
 * 获取格式化range：从左上到右下
 * @param range 范围
 * @returns 格式化范围
 */
export function getFormatedRange(range: ICellRange): ICellRange {
    const { from, to } = range;
    // 对比数值
    const isFromColLarger = compareCell(from, to, "col") === 1;
    // 类型不同时header<body，否则对比数值
    const isFromRowLarger = compareCell(from, to, "row") === 1;
    return {
        from: {
            col: isFromColLarger ? to.col : from.col,
            row: isFromRowLarger ? to.row : from.row,
            type: isFromRowLarger ? to.type : from.type
        },
        to: {
            col: isFromColLarger ? from.col : to.col,
            row: isFromRowLarger ? from.row : to.row,
            type: isFromRowLarger ? from.type : to.type
        }
    }
}
/**
 * 单方向的当前范围相对于对比范围的范围关系
 * @param current 当前范围
 * @param target 对比范围
 * @param type 对比类型，row行col列
 * @returns 关系结果
 */
export function getRangeLineRelation(current: ICellRange, target: ICellRange, type: "row" | "col"): IRangeRelation {
    const formatedCurrent = getFormatedRange(current);
    const foramtedTarget = getFormatedRange(target);
    const compareFrom = compareCell(formatedCurrent.from, foramtedTarget.from, type);
    const compareTo = compareCell(formatedCurrent.to, foramtedTarget.to, type);
    if (compareFrom === 0 && compareTo === 0) {
        // 起点终点完全相同
        return "same";
    } else if (compareFrom >= 0 && compareTo <= 0) {
        // 包含于target
        return "in";
    } else if (compareFrom <= 0 && compareTo >= 0) {
        // 包含target
        return "contain";
    } else if (compareCell(formatedCurrent.from, foramtedTarget.to, type) > 0 || compareCell(formatedCurrent.to, foramtedTarget.from, type) < 0) {
        return "out";
    } else {
        return "part";
    }
}

/**
 * current range相对于target range的关系
 * @param current 当前范围
 * @param target 对比范围
 * @returns 关系结果
 */
export function getRangeRelation(current: ICellRange, target: ICellRange): IRangeRelation {
    const rowRelation = getRangeLineRelation(current, target, "row");
    const colRelation = getRangeLineRelation(current, target, "col");
    const inRangeTypes: IRangeRelation[] = ["same", "in"];
    const containRangeTypes: IRangeRelation[] = ["same", "contain"];
    if (rowRelation === "same" && colRelation === "same") {
        return "same";
    } else if (inRangeTypes.includes(rowRelation) && inRangeTypes.includes(colRelation)) {
        return "in";
    } else if (containRangeTypes.includes(rowRelation) && containRangeTypes.includes(colRelation)) {
        return "contain";
    } else if (rowRelation === "out" || colRelation === "out") {
        return "out";
    } else {
        return "part";
    }
}

/**
 * current cell相对于target range的关系
 * @param cell 当前单元格
 * @param target 目标范围，不使用合并后单元格
 * @returns 关系结果
 */
export function getCellRelationToRange(cell: ICellKey, mintarget: ICellRange) {
    return getRangeRelation({ from: cell, to: cell }, mintarget);
}
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
 * 获取范围内的单元格列表
 * @param formattedRange 格式化范围
 * @param deep 表头深度
 * @returns 单元格列表
 */
export function getRangeCells(formattedRanges: ICellRange[], deep: number): ICellKey[] {
    const cellMap: Map<string, ICellKey> = new Map();
    const pushcell = (cell: ICellKey) => {
        cellMap.set(getCellKey(cell), cell);
    }
    formattedRanges.map(formattedRange => {
        const { from, to } = formattedRange;
        for (let col = from.col; col <= to.col; col++) {
            if (from.type === to.type) {
                for (let row = from.row; row <= to.row; row++) {
                    pushcell({ type: from.type, col, row });
                }
            } else {
                for (let row = from.row; row <= deep; row++) {
                    pushcell({ type: from.type, col, row });
                }
                for (let row = 0; row <= to.row; row++) {
                    pushcell({ type: to.type, col, row });
                }
            }
        }
    });
    const cells: ICellKey[] = [];
    cellMap.forEach((value) => cells.push(value));
    return cells;
}


/**
 * 判空取值
 * @param target 取值目标
 * @param paths 路径
 */
export function getValue(target: any, paths: string[] | string) {
    paths = Array.isArray(paths) ? paths : paths.split(".");
    let cur = target;
    if (!cur) {
        return cur;
    }
    for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        cur = cur[p];
        if (!cur) {
            break;
        }
    }
    return cur;
}

/**
 * 按顺序取最后的有效值
 * @param target 取值目标
 * @param paths 路径列表
 * @returns 值
 */
export function getPriorityValue(target: any, paths: Array<string[] | string>) {
    let res = undefined;
    for (let i = 0; i < paths.length; i++) {
        const current = getValue(target, paths[i]);
        if (current !== null || current !== undefined) {
            res = current;
            break;
        }
    }
    return res;
}
/**
 * 判空设置值
 * @param target 设值目标
 * @param paths 路径
 * @param value 值
 */
export function setValue(target: any, paths: string[], value: any) {
    const len = paths.length;
    paths.map((p, idx) => {
        if (idx === len - 1) {
            if (value === undefined) {
                if (p in target) {
                    delete target[p];
                }   
            } else {
                target[p] = value;
            }
        } else {
            p = p.toString();
            const isArray = p.startsWith("ary");
            const realP = p.replace(/^ary/, "");
            target[realP] = target[realP] || (isArray ? [] : {});
            target = target[realP];
        }
    });
}