import ContentStore from "../store/ContentStore";
import { ICellKey, ICellRange, IGlobalRange, IRangeAryType, IRangeRelation, IRangeType } from "../../interfaces/IDriverContent";
import { getAry } from "./valueUtil";
export default class RangeUtil {
    store: ContentStore;
    constructor(store: ContentStore) {
        this.store = store;
    }
    /** 获取起始/结束单元格 
     * @param store 存储
     * @param grange 全局范围类型
     * @param type 起点还是终点
    */
    getCornerCell(grange: IGlobalRange = "all", type: "start" | "end" = "end"): ICellKey | null{
        const store = this.store;
        const istart = type === "start";
        if (store.columns.size()) {
            const col = istart ? store.columns.key(0)?.key : store.columns.lastKey();
            if (grange === "header") {
                const row = istart ? store.rows.typeKey("header", 0) : store.rows.typeLastKey("header");
                return row ? { row, col, type: "header" } : null;
            } else if (grange === "body") {
                const row = istart ? store.rows.typeKey("body", 0) : store.rows.typeLastKey("body");
                return row ? { row, col, type: "body" } : null;
            } else {
                const row = istart ? store.rows.key(0) : store.rows.lastKey();
                // return row ? { row, col, type: "body" } : null;
            }
        }
    }

}

/***********************范围查找 ****************************/
/** 获取起始/结束单元格 
 * @param store 存储
 * @param grange 全局范围类型
 * @param type 起点还是终点
*/
export function getCornerCell(store: ContentStore, grange: IGlobalRange = "all", type: "start" | "end" = "end"): ICellKey | null {
    if (store.columns.size()) {
        const col = store.columns.key(0);
        if (store.headers.size() && grange !== "body") {
            const row = store.headers.key(0);
            return { col, row, type: "header" };
        } else if (store.rows.size() && grange !== "header") {
            const row = store.rows.key(0);
            return { col, row, type: "body" };
        }
    }
    return null;
}
/**
 * 将对象转成range类型
 * @param target 目标范围
 * @returns {ICellRange} 范围数组，not formatted, not minTarget
 */
export function getTargetRange(store: ContentStore, target: IRangeType): ICellRange | null {
    if (target === false || typeof (target) === "string") {
        const grange = target === false ? store.grange : target;
        const from = getCornerCell(store, grange, "start");
        const to = getCornerCell(store, grange, "end");
        return from && to ? { from, to } : null;
    } else if ('from' in target) { // range
        return target;
    } else if ('type' in target && 'col' in target) { // cell
        return { from: target, to: target };
    } else if ('type' in target) { // row
        const from = getCornerCell(store, target.type, "start");
        if (!from) {
            return null;
        }
        const cell: ICellKey = { row: target.row, type: target.type, col: from.col };
        return { from: cell, to: cell };
    } else { // col
        const from = getCornerCell(store, "all", "start");
        if (!from) {
            return null;
        }
        const cell: ICellKey = { row: from.row, type: from.type, col: target.col };
        return { from: cell, to: cell };
    }
}

/**
 * 将对象转成range类型数组
 * @param target 目标范围
 * @returns {ICellRange[]} 范围数组，not formatted, not minTarget
 */
export function getTargetRangeList(store: ContentStore, range: IRangeAryType): ICellRange[] {
    const ary = getAry(range);
    const res: ICellRange[] = [];
    ary.map(r => {
        const cur = getTargetRange(store, r);
        if (cur) {
            res.push(cur);
        }
    });
    return res;
}

/***********************范围关系 ****************************/

/**
 * 对比，0等于，1大于，-1小于，用于对比单元格关系
 * @param a 单元格
 * @param b 单元格
 * @param type 对比类型，row行col列
 * @returns 对比结果
 */
export function compareCell(store: ContentStore, a: ICellKey, b: ICellKey, type: "row" | "col"): number {
    if (type === "col") {
        const va = store.columns.index(a.col);
        const vb = store.columns.index(b.col);
        return va === vb ? 0 : va > vb ? 1 : -1;
    } else {
        if (a.type === b.type) {
            const ary = a.type === "header" ? store.headers : store.rows;
            const va = ary.index(a.row);
            const vb = ary.index(b.row);
            return va === vb ? 0 : va > vb ? 1 : -1;
        } else {
            return a.type === "header" ? -1 : 1;
        }
    }
}

/**
 * 对比值，向source写入合并后的量
 */
export function getComparedValue(store: ContentStore, source: ICellKey, compare: ICellKey, type: "row" | "col", valType: "min" | "max") {
    const compareVal = compareCell(store, source, compare, type);
    const needSwitch = valType === "max" ? compareVal < 0 : compareVal > 0;
    if (needSwitch) {
        if (type === "row") {
            source.row = compare.row;
            source.type = compare.type;
        } else {
            source.col = compare.col;
        }
    }
}

/**
 * 单方向的当前范围相对于对比范围的范围关系
 * @param formatedCurrent 当前范围, formatted min range
 * @param foramtedTarget 对比范围, formatted min range
 * @param type 对比类型，row行col列
 * @returns 关系结果
 */
export function getRangeLineRelation(store: ContentStore, formatedCurrent: ICellRange, foramtedTarget: ICellRange, type: "row" | "col"): IRangeRelation {
    const compareFrom = compareCell(store, formatedCurrent.from, foramtedTarget.from, type);
    const compareTo = compareCell(store, formatedCurrent.to, foramtedTarget.to, type);
    if (compareFrom === 0 && compareTo === 0) {
        // 起点终点完全相同
        return "same";
    } else if (compareFrom >= 0 && compareTo <= 0) {
        // 包含于target
        return "in";
    } else if (compareFrom <= 0 && compareTo >= 0) {
        // 包含target
        return "contain";
    } else if (compareCell(store, formatedCurrent.from, foramtedTarget.to, type) > 0 || compareCell(store, formatedCurrent.to, foramtedTarget.from, type) < 0) {
        return "out";
    } else {
        return "part";
    }
}
/**
 * current range相对于target range的关系
 * @param current 当前范围, formatted min range
 * @param target 对比范围, formatted min range
 * @returns 关系结果
 */
export function getFormattedRangeRelation(store: ContentStore, current: ICellRange, target: ICellRange): IRangeRelation {
    const rowRelation = getRangeLineRelation(store, current, target, "row");
    const colRelation = getRangeLineRelation(store, current, target, "col");
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
/** 带格式化的范围关系
 * @param current 当前范围
 * @param target 对比范围
 * @returns 关系结果
 */
export function getRangeRelation(store: ContentStore, current: ICellRange, target: ICellRange) {
    const fcurrent = getFormattedMinRange(store, current);
    const ftarget = getFormattedMinRange(store, target);
    return getFormattedRangeRelation(store, fcurrent, ftarget);
}

/**
 * current cell相对于target range的关系
 * @param cell 当前单元格
 * @param target 目标范围
 * @returns 关系结果
 */
export function getCellRelationToRange(store: ContentStore, cell: ICellKey, target: ICellRange): IRangeRelation {
    return getRangeRelation(store, { from: cell, to: cell }, target);
}


/***********************范围格式化 ****************************/

/**
 * 范围格式化，左上=>右下
 * @param range 
 */
export function getFormattedRange(store: ContentStore, range: ICellRange) {
    const { from, to } = range;
    // 对比数值
    const isFromColLarger = compareCell(store, from, to, "col") === 1;
    // 类型不同时header<body，否则对比数值
    const isFromRowLarger = compareCell(store, from, to, "row") === 1;
    // 左上=>右下
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
 * 处理合并单元格交错
 * @param range 范围
 */
export function getMergedRange(store: ContentStore, range: ICellRange): ICellRange {
    const formatted = getFormattedMinRange(store, range);
    (store.content.merged || []).map(mr => {
        mr = getFormattedRange(store, mr);
        const r = getRangeRelation(store, formatted, mr);
        if (r === "part" || r === "in") {
            getComparedValue(store, formatted.from, mr.from, "row", "min");
            getComparedValue(store, formatted.from, mr.from, "col", "min");
            getComparedValue(store, formatted.to, mr.to, "row", "max");
            getComparedValue(store, formatted.to, mr.to, "col", "max");
        }
    });
    return getFormattedMergeRange(store, formatted);
}

/**
 * 查找当前单元格所在合并单元格
 * @param store 存储
 * @param cell 当前单元格
 * @returns {ICellRange | null} 合并范围
 */
export function getMergedTarget(store: ContentStore, cell: ICellKey): ICellRange | null {
    const target = (store.content.merged || []).find(current => {
        const cellr = { from: cell, to: cell };
        const merger = getFormattedRange(store, current);
        return getFormattedRangeRelation(store, cellr, merger) !== "out";
    });
    return target ? getFormattedRange(store, target) : null;
}

/** 最小格的格式化范围
 * @param range 范围
 * @param merged 合并单元格列表
 */
export function getFormattedMinRange(store: ContentStore, range: ICellRange): ICellRange {
    let { from, to } = getFormattedRange(store, range);
    const target = getMergedTarget(store, to);
    if (target) {
        to = target.to;
    }
    return { from, to };
}

/** 合并单元格的格式化范围
 * @param range 范围
 * @param merged 合并单元格列表
 */
export function getFormattedMergeRange(store: ContentStore, range: ICellRange): ICellRange {
    let { from, to } = getFormattedRange(store, range);
    const target = getMergedTarget(store, to);
    if (target) {
        to = target.from;
    }
    return { from, to };
}