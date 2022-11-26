import { ICellKey, ICellRange } from "../interfaces/IGlobalType";
import { getCellTypeKey } from "../utils/keyUtil";
import { getFormattedMinRange, getRangeCellList, getRangeRelation, getTargetRange } from "../utils/rangeUtil";
import EvDriver from "./EvDriver";
/**
 * 计算总宽度/高度，用于select range展示
 * @param driver 控制器
 * @param dfrom 起始格
 * @param dto 终止格
 * @param type 方向
 * @param include 是否包含终止格
 * @returns {number} 总和
 */
export function getLength(driver: EvDriver, dfrom: ICellKey | null, dto: ICellKey | null, type: "col" | "row", include: boolean) {
    const startCell = getTargetRange(driver, "all").from;
    const range: ICellRange = {
        from: dfrom || startCell,
        to: dto || startCell
    };
    const { from, to } = getFormattedMinRange(range, driver.content.merged || []);
    const cellRange: ICellRange = {
        from,
        to: type === "row" ? { ...to, col: from.col } : { ...to, row: from.row, type: from.type }
    };
    const cells = getRangeCellList([cellRange], driver.content.merged || [], driver.content.deep || 0);

    const sum = cells.reduce((pre, cur) => {
        const key = getCellTypeKey(cur, type);
        const contain = include || (key !== getCellTypeKey(cellRange.to, type));
        return pre + (contain ? (driver.sizes[key] || 0) : 0);
    }, 0);
    return sum;
}

export function isMerged(driver: EvDriver) {
    const selected = driver.content.selected;
    const merged = driver.content.merged;
    if (selected?.length && merged?.length) {
        // 范围内全部都是合并单元格
        return selected.findIndex(range => {
            const isMergeRange = merged.findIndex(mr => getRangeRelation(mr, range, merged) === "same");
            return isMergeRange < 0;
        }) < 0;
    } else {
        // 没有合并区域
        return false;
    }
}