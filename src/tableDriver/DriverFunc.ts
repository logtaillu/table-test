/**
 * 不涉及内部状态的辅助函数
 */
import { ICellKey, ICellRange, IColKey, IGlobalRange, IRangeRelation, IRowKey } from "./ITableDriver";
import { getCellKey } from "./keyFunc";
import TableDriver from "./TableDriver";


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
 * @description 从单个行/列等获取目标范围
 */
export function getTargetRange(target: ICellRange[] | ICellRange | ICellKey | IRowKey | IColKey): ICellRange[] {
    if (Array.isArray(target)) {
        return target;
    }
    if ('from' in target) {
        return [target];
    } else if ('row' in target) {
        return [{
            from: target,
            to: target
        }];
    } else if ('type' in target) {
        const cell: ICellKey = { row: target.index, type: target.type, col: 0 };
        return [{ from: cell, to: cell }];
    } else {
        const cell: ICellKey = { row: target.index, type: "body", col: 0 };
        return [{ from: cell, to: cell }];
    }
}

export function getMergedTarget(merged: ICellRange[], cell: ICellKey): ICellRange | null {
    const target = merged.find(current => {
        return getCellRelationToRange(cell, current) !== "out";
    });
    return target ? getFormatedRange(target) : null;
}
/**
 * 处理合并单元格后的range
* @param range 范围
* @param useMerged 是否使用合并后单元格
* @returns 格式化范围
 */
export function getRangeHandleMerged(merged: ICellRange[], range: ICellRange, useMerged: boolean): ICellRange {
    let { from, to } = getFormatedRange(range);
    // 考虑非最小格的情况，找到包含右下角的
    const target = getMergedTarget(merged, to);
    if (target) {
        to = useMerged ? target.from : target.to;
    }
    return { from, to };
}