import { ICellKey, ICellRange } from "../interfaces/IGlobalType";
import { getCellTypeKey } from "../utils/keyUtil";
import logUtil from "../utils/logUtil";
import { getFormattedMinRange, getRangeCellList, getTargetRange } from "../utils/rangeUtil";
import EvDriver from "./EvDriver";

export function getLength(driver: EvDriver, dfrom: ICellKey | null, dto: ICellKey | null, type: "col" | "row") {
    const startCell =  getTargetRange(driver, "all").from;
    const range: ICellRange = {
        from: dfrom || startCell,
        to: dto || startCell
    };
    const { from, to } = getFormattedMinRange(range, driver.content.merged || []);
    const cellRange: ICellRange = {
        from,
        to: type === "col" ? { ...to, col: from.col } : { ...to, row: from.row }
    };
    const cells = getRangeCellList([cellRange], driver.content.merged || [], driver.content.deep || 0);
    const sum = cells.reduce((pre, cur) => {
        const key = getCellTypeKey(cur, type);
        return pre + (driver.sizes[key] || 0);
    }, 0);
    return sum;
}