import { getRangeHandleMerged, compareCell, getMergedTarget } from "../tableDriver/DriverFunc";
import { IBorderType, ICellCssVars, ICellKey, ICellRange, IGlobalBorderConfig, IGlobalRange, IRangeSetAry } from "../tableDriver/ITableDriver";
import { getCellKey } from "../tableDriver/keyFunc";
import TableDriver from "../tableDriver/TableDriver";
import { getValue } from "../tableDriver/ValueFunc";
export const borderKeys = ["t", "b", "l", "r"];
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
    if (range === "body" || (range === "all" && !driver.headerDeep)) {
        cellrange = {
            from: { row: 0, col: 0, type: "body" },
            to: { row: getCount(driver.config.rowCount || 0), col: getCount(driver.config.colCount || 0), type: "body" }
        };
    } else if (range === "header" || (range === "all" && !driver.config.rowCount)) {
        cellrange = {
            from: { row: 0, col: 0, type: "header" },
            to: { row: getCount(driver.headerDeep), col: getCount(driver.config.colCount || 0), type: "header" }
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
        t: compareCell(mergedRange ? mergedRange.from : cell, cellrange.from, "row") === 0,
        b: compareCell(mergedRange ? mergedRange.to : cell, cellrange.to, "row") === 0,
        l: compareCell(mergedRange ? mergedRange.from : cell, cellrange.from, "col") === 0,
        r: compareCell(mergedRange ? mergedRange.to : cell, cellrange.to, "col") === 0
    }
}
/**
 * 获取当前cell相对于range，在当前boder type下拥有的边框
 * 不考虑当前元素持有哪些边，因为css控制了
 * @param driver 控制器
 * @param cell 单元格
 * @param range 范围
 */
function getCellBorderByPositon(driver: TableDriver, cell: ICellKey, range: ICellRange | IGlobalRange, borderType: IBorderType): { l?: boolean, b?: boolean, t?: boolean, r?: boolean, clear?: boolean } {
    const pos = getCellPostionToRange(driver, cell, range);
    let enable = {};
    // all/none类型是全设置，其他的都是加上特定边
    switch (borderType) {
        case "all": enable = { l: true, t: true, r: true, b: true }; break;
        case "none": enable = { l: false, t: false, r: false, b: false, clear: true }; break;
        case "left": enable = { l: pos.l }; break;
        case "right": enable = { r: pos.r }; break;
        case "top": enable = { t: pos.t }; break;
        case "bottom": enable = { b: pos.b }; break;
        case "inner": enable = { l: !pos.l, t: !pos.t, r: !pos.r, b: !pos.b }; break;
        case "outter": enable = { l: pos.l, t: pos.t, r: pos.r, b: pos.b }; break;
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
    const bexists = {};
    const cssvars: Partial<ICellCssVars> = {};
    borderKeys.map(pos => {
        cssvars[`--cell-b-color-${pos}`] = color;
        cssvars[`--cell-b-style-${pos}`] = style;
        cssvars[`--cell-b-width-${pos}`] = width;
        bexists[pos] = !!borders[pos];
    });
    return { cssvars, bexists };
}

/**
 * 获取当前单元格的cssvars，用于cell获取cssvars
 * @param driver 控制器
 * @param cell 单元格
 */
export function getCellCssVars(driver: TableDriver, cell: ICellKey) {
    const cellvars = getValue(driver.config, ["cell", getCellKey(cell), "cssvars"]);
    const { cssvars, bexists } = getGlobalCellBorder(driver, cell);
    const result = { ...cssvars, ...cellvars };
    Object.keys(bexists).map(key => {
        const val = getValue(driver.config, ["cell", getCellKey(cell), "b" + key]);
        const existBorder = typeof (val) === "boolean" ? val : bexists[key];
        if (!existBorder) {
            result[`--cell-b-color-${key}`] = 0;
        }
    })
    return result;
}
/**
 * 获取单元格实际的四边归属
 */
export function getCellBorder(driver: TableDriver, cell: ICellKey, range: ICellRange, value: Partial<IGlobalBorderConfig>) {
    // 当前单元格在全局中的位置
    const globalPos = getCellPostionToRange(driver, cell, cell.type);
    // 各边需要设置的值
    const borders = {};
    borderKeys.map(key => borders[key] = [{ cell, type: key }]);
    if (!globalPos.l) {
        borders["l"].push({ cell: { ...cell, col: cell.col - 1 }, type: "r" });
    }
    if (!globalPos.t) {
        borders["t"].push({ cell: { ...cell, row: cell.row - 1 }, type: "b" });
    }
    const { bordeType, ...others } = value;
    const confs: IRangeSetAry = [];
    if (bordeType) {
        // 当前节点在range内可以展示的边
        const pos = getCellBorderByPositon(driver, cell, range, bordeType);
        borderKeys.map(key => {
            if (pos[key]) {
                (borders[key] || []).map(({ cell: cur, type }) => {
                    confs.push({ type: "cell", key: ["b" + type] as any[], value: true, range: [cur] });
                });// end cell map
            } else if (pos[key] === false && pos.clear) {
                (borders[key] || []).map(({ cell: cur, type }) => {
                    confs.push({ type: "cell", key: ["b" + type] as any[], value: false, range: [cur] });
                });// end cell map
            }
        })
    }

    // 其他值设值
    const map = { borderColor: "color", borderStyle: "style", borderWidth: "width" };
    Object.keys(others || {}).map(key => {
        Object.keys(borders).map(pos => {
            (borders[pos] || []).map(({ cell: cur, type }) => {
                confs.push({ type: "cell", key: ["cssvars", `--cell-b-${map[key]}-${type}` as any], value: others[key], range: cur });
            });// end cell map
        }) // end pos map
    })// end key map
    return confs;
}