/** 范围相关函数 */

import EvDriver from "../driver/EvDriver";
import { IRangeType, ICellRange, ICellKey, IRangeAryType, IRangeRelation } from "../interfaces/IGlobalType";
import { getCellKey } from "./keyUtil";
/***********************范围转换 ****************************/
/**
 * 将对象转成range类型
 * @param target 目标范围
 * @returns {ICellRange} 范围数组，not formatted, not minTarget
 */
export function getTargetRange(driver: EvDriver, target: IRangeType): ICellRange {
    if (target === false || typeof (target) === "string") {
        const grange = target === false ? driver.globalRange : target;
        const getCount = val => Math.max(val - 1, 0);
        if (grange === "body" || (grange === "all" && !driver.content?.deep)) {
            return {
                from: { row: 0, col: 0, type: "body" },
                to: { row: getCount(driver.content?.rowCount || 0), col: getCount(driver.content?.colCount || 0), type: "body" }
            }
        } else if (grange === "header" || (grange === "all" && !driver.content?.rowCount)) {
            return {
                from: { row: 0, col: 0, type: "header" },
                to: { row: getCount(driver.content?.deep || 0), col: getCount(driver.content?.colCount || 0), type: "header" }
            }
        } else {
            return {
                from: { row: 0, col: 0, type: "header" },
                to: { row: getCount(driver.content?.rowCount || 0), col: getCount(driver.content?.colCount || 0), type: "body" }
            }
        }
    } else if ('from' in target) { // range
        return target;
    } else if ('type' in target && 'col' in target) { // cell
        return { from: target, to: target };
    } else if ('type' in target) { // row
        const cell: ICellKey = { row: target.row, type: target.type, col: 0 };
        return { from: cell, to: cell };
    } else { // col
        const cell: ICellKey = { row: 0, type: "body", col: target.col };
        return { from: cell, to: cell };
    }
}
/**
 * 将对象转成range类型数组
 * @param target 目标范围
 * @returns {ICellRange[]} 范围数组，not formatted, not minTarget
 */
export function getTargetRangeList(driver: EvDriver, range: IRangeAryType): ICellRange[] {
    return Array.isArray(range) ? range.map(r=>getTargetRange(driver, r)) : [getTargetRange(driver, range)];
}

/***********************范围格式化 ****************************/

/**
 * 对比，0等于，1大于，-1小于，用于对比单元格关系
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
 * 范围格式化，左上=>右下
 * @param range 范围
 */
export function getFormattedRange(range: ICellRange): ICellRange {
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
 * 查找合并单元格
 * @param merged 合并单元格列表
 * @param cell 当前单元格
 * @returns {ICellRange | null} 合并范围
 */
export function getMergedTarget(merged: ICellRange[], cell: ICellKey): ICellRange | null {
    const target = merged.find(current => {
        return getCellRelationToRange(cell, current, []) !== "out";
    });
    return target ? getFormattedRange(target) : null;
}

/** 最小格的格式化范围
 * @param range 范围
 * @param merged 合并单元格列表
 */
export function getFormattedMinRange(range: ICellRange, merged: ICellRange[]): ICellRange {
    let { from, to } = getFormattedRange(range);
    const target = getMergedTarget(merged, to);
    if (target) {
        to = target.to;
    }
    return { from, to };
}

/** 合并单元格的格式化范围
 * @param range 范围
 * @param merged 合并单元格列表
 */
export function getFormattedMergeRange(range: ICellRange, merged: ICellRange[]): ICellRange {
    let { from, to } = getFormattedRange(range);
    const target = getMergedTarget(merged, to);
    if (target) {
        to = target.from;
    }
    return { from, to };
}

/***********************范围关系 ****************************/
/**
 * 单方向的当前范围相对于对比范围的范围关系
 * @param current 当前范围
 * @param target 对比范围
 * @param type 对比类型，row行col列
 * @returns 关系结果
 */
export function getRangeLineRelation(current: ICellRange, target: ICellRange, type: "row" | "col", merged: ICellRange[]): IRangeRelation {
    const formatedCurrent = getFormattedMinRange(current, merged);
    const foramtedTarget = getFormattedMinRange(target, merged);
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
export function getRangeRelation(current: ICellRange, target: ICellRange, merged: ICellRange[]): IRangeRelation {
    const rowRelation = getRangeLineRelation(current, target, "row", merged);
    const colRelation = getRangeLineRelation(current, target, "col", merged);
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
 * @param target 目标范围
 * @returns 关系结果
 */
export function getCellRelationToRange(cell: ICellKey, target: ICellRange, merged: ICellRange[]): IRangeRelation {
    return getRangeRelation({ from: cell, to: cell }, target, merged);
}

/***********************取单元格列表 ****************************/
export function getRangeCellList(ranges: ICellRange[], merged: ICellRange[], deep: number) {
    const cellMap: Map<string, ICellKey> = new Map();
    const pushcell = (cell: ICellKey) => {
        cellMap.set(getCellKey(cell), cell);
    };
    ranges.map(r => {
        const { from, to } = getFormattedMinRange(r, merged);
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