/**
 * 不涉及内部状态的辅助函数
 */
import { ICellKey, ICellRange, IColKey, IRangeRelation, IRowKey } from "./ITableDriver";


// 对比，0等于，1大于，-1小于
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
// 获取格式化range：从左上到右下
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
// 单方向的range关系，默认已格式化
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

// current range相对于target range的关系
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

// current cell相对于target range的关系
export function getCellRelationToRange(cell: ICellKey, target: ICellRange) {
    return getRangeRelation({ from: cell, to: cell }, target);
}
// string类型cell key
export function getCellKey(cell: ICellKey) {
    return [cell.type, cell.row, cell.col].join("-");
}
// string类型row key
export function getRowKey(row: IRowKey) {
    return [row.type, row.index].join("-");
}
// string类型col key
export function getColKey(col: IColKey) {
    return col.index + "";
}
// 获取范围内的单元格
export function getRangeCells(formattedRange: ICellRange, deep: number): ICellKey[] {
    const { from, to } = formattedRange;
    const cells: ICellKey[] = [];
    for (let col = from.col; col <= to.col; col++) {
        if (from.type === to.type) {
            for (let row = from.row; row <= to.row; row++) {
                cells.push({ type: from.type, col, row });
            }
        } else {
            for (let row = from.row; row <= deep; row++) {
                cells.push({ type: from.type, col, row });
            }
            for (let row = 0; row <= to.row; row++) {
                cells.push({ type: to.type, col, row });
            }
        }
    }
    return cells;
}