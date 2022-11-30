/** 范围相关函数 */

import EvDriver from "../driver/EvDriver";
import { IRangeType, ICellRange, ICellKey, IRangeAryType, IRangeRelation } from "../interfaces/IGlobalType";
import { getCellKey } from "./keyUtil";

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
                for (let row = from.row; row < deep; row++) {
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