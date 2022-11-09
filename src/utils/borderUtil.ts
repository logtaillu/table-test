import { getRangeHandleMerged, compareCell, getMergedTarget } from "../tableDriver/DriverFunc";
import { IBorderType, ICellCssVars, ICellKey, ICellRange, IGlobalRange } from "../tableDriver/ITableDriver";
import { getCellKey } from "../tableDriver/keyFunc";
import TableDriver from "../tableDriver/TableDriver";
import { getValue } from "../tableDriver/ValueFunc";

/**
 * 获取cell相对于范围的位置，用于border处理
 * @param driver 控制器
 * @param cell 单元格
 * @param range 范围
 * @returns 四向关系
 */
function getCellPostionToRange(driver: TableDriver, cell: ICellKey, range: ICellRange | IGlobalRange) {
    // 1. 获取cell range[formated, no merged cell]
    let cellrange: ICellRange;
    const getCount = val => Math.max(val - 1, 0);
    if (range === "header" || (range === "all" && !driver.config.rowCount)) {
        cellrange = {
            from: { row: 0, col: 0, type: "header" },
            to: { row: getCount(driver.headerDeep), col: getCount(driver.config.colCount || 0), type: "header" }
        };
    } else if (range === "body" || (range === "all" && !driver.headerDeep)) {
        cellrange = {
            from: { row: 0, col: 0, type: "body" },
            to: { row: getCount(driver.config.rowCount || 0), col: getCount(driver.config.colCount || 0), type: "body" }
        };
    } else if (range === "all") {
        cellrange = {
            from: { row: 0, col: 0, type: "header" },
            to: { row: getCount(driver.config.rowCount || 0), col: getCount(driver.config.colCount || 0), type: "body" }
        };
    } else {
        cellrange = getRangeHandleMerged(driver.config.merged || [], range, false);
    }
    // 对于merged的单元格，同时处理from和to
    const mergedRange = getMergedTarget(driver.config.merged || [], cell);
    console.log(cell, cellrange);
    return {
        top: compareCell(mergedRange ? mergedRange.from : cell, cellrange.from, "row") === 0,
        bottom: compareCell(mergedRange ? mergedRange.to : cell, cellrange.to, "row") === 0,
        left: compareCell(mergedRange ? mergedRange.from : cell, cellrange.from, "col") === 0,
        right: compareCell(mergedRange ? mergedRange.to : cell, cellrange.to, "col") === 0
    }
}
/**
 * 获取当前cell相对于range，在当前boder type下拥有的边框
 * 不考虑当前元素持有哪些边，因为css控制了
 * @param driver 控制器
 * @param cell 单元格
 * @param range 范围
 */
function getCellBorderByPositon(driver: TableDriver, cell: ICellKey, range: ICellRange | IGlobalRange, borderType: IBorderType) {
    const pos = getCellPostionToRange(driver, cell, range);
    let enable = {};
    // all/none类型是全设置，其他的都是加上特定边
    switch (borderType) {
        case "all": enable = { l: true, t: true, r: true, b: true }; break;
        case "none": enable = { l: false, t: false, r: false, b: false, clear: true }; break;
        case "left": enable = { l: pos.left }; break;
        case "right": enable = { r: pos.right }; break;
        case "top": enable = { t: pos.top }; break;
        case "bottom": enable = { b: pos.bottom }; break;
        case "inner": enable = { l: !pos.left, t: !pos.top, r: !pos.right, b: !pos.bottom }; break;
        case "outter": enable = { l: pos.left, t: pos.top, r: pos.right, b: pos.bottom }; break;
        case "horinzontal": enable = { t: true, b: true }; break;
        case "vertical": enable = { l: true, r: true }; break;
    }
    return enable;
}
/**
 * 获取当前cell在global下的border css var设置
 * @param driver 控制器
 * @param cell 单元格
 */
export function getGlobalCellBorder(driver: TableDriver, cell: ICellKey) {
    const type = driver.getRangeValue("cell", "bordeType", cell);
    const color = driver.getRangeValue("cell", "borderColor", cell);
    const style = driver.getRangeValue("cell", "borderStyle", cell);
    const width = driver.getRangeValue("cell", "borderWidth", cell);
    const range = getValue(driver.config, [cell.type, "cell", "bordeType"]) ? cell.type : "all";
    const borders = getCellBorderByPositon(driver, cell, range, type);
    const res: Partial<ICellCssVars> = {};
    ["t", "b", "l", "r"].map(pos => {
        res[`--cell-b-color-${pos}`] = color;
        res[`--cell-b-style-${pos}`] = style;
        res[`--cell-b-width-${pos}`] = !!borders[pos] ? width : 0;
    });
    return res;
}
/**
 * 获取当前单元格的cssvars，用于cell获取cssvars
 * @param driver 控制器
 * @param cell 单元格
 */
export function getCellCssVars(driver: TableDriver, cell: ICellKey) {
    const cellvars = getValue(driver.config, ["cell", getCellKey(cell), "cssvars"]);
    const globalvars = getGlobalCellBorder(driver, cell);
    return { ...globalvars, ...cellvars };
}