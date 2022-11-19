import EvDriver from "../driver/EvDriver";
import { ICellCssVars, IGlobalBorderConfig } from "../interfaces/IConfig";
import { IConfigKey, IMultiRangeSetter } from "../interfaces/IDriverCache";
import { IBorderType, ICellKey, ICellRange, IRangeType } from "../interfaces/IGlobalType";
import { getCellKey } from "./keyUtil";
import { compareCell, getFormattedMinRange, getMergedTarget, getTargetRange } from "./rangeUtil";
import { getValue } from "./valueUtil";

export const borderKeys = ["t", "b", "l", "r"];
/**
 * 获取cell相对于范围的位置，用于border处理
 * @param driver 控制器
 * @param cell 单元格
 * @param range 范围
 * @returns 四向关系
 */
function getCellPostionToRange(driver: EvDriver, cell: ICellKey, range: IRangeType) {
    // 1. 获取cell range[formated, no merged cell]
    let cellrange: ICellRange = getTargetRange(driver, range);
    cellrange = getFormattedMinRange(cellrange, driver.merged);
    // 对于merged的单元格，同时处理from和to
    const mergedRange = getMergedTarget(driver.merged || [], cell);
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
function getCellBorderByPositon(driver: EvDriver, cell: ICellKey, range: IRangeType, borderType: IBorderType): { l?: boolean, b?: boolean, t?: boolean, r?: boolean, clear?: boolean } {
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
export function getGlobalCellBorder(driver: EvDriver, cell: ICellKey) {
    // 获取四个值
    const type = driver.getValue("cell", "borderType", cell);
    const color = driver.getValue("cell", "borderColor", cell);
    const style = driver.getValue("cell", "borderStyle", cell);
    const width = driver.getValue("cell", "borderWidth", cell);
    const range = getValue(driver.content, [cell.type, "cell", "borderType"]) ? cell.type : "all";
    const borders = getCellBorderByPositon(driver, cell, range, type);
    const bexists = {};
    const cssvars: Partial<ICellCssVars> = {};
    borderKeys.map(pos => {
        cssvars[`--ev-bc${pos}`] = color;
        cssvars[`--ev-bs${pos}`] = style;
        cssvars[`--ev-bw${pos}`] = width;
        bexists["b" + pos] = !!borders[pos];
    });
    return { cssvars, bexists };
}

/**
 * 获取当前单元格的cssvars，用于cell获取cssvars
 * @param driver 控制器
 * @param cell 单元格
 */
export function getCellCssVars(driver: EvDriver, cell: ICellKey) {
    // 单元格初始cssvar
    let cellvars = getValue(driver.content, ["cell", getCellKey(cell), "cssvar"]);
    const colCellVars = getValue(driver.content, ["col", cell.type, "cssvar"]);
    // 全局类型设置的样式
    const { cssvars, bexists } = getGlobalCellBorder(driver, cell);
    const result = { ...colCellVars, ...cellvars };
    Object.keys(bexists).map((key: any) => {
        // 方向是否有边框，内部的优先级更高
        let innerExist = driver.getValue("cell", key, cell);
        if (typeof (innerExist) !== "boolean") {
            innerExist = bexists[key];
        }
        // 方向遍历
        borderKeys.map(pos => {
            // 颜色、样式处理
            ["c", "s"].map(k => {
                const key = `--ev-b${k}${pos}`;
                const val = driver.getValue("cell", ["cssvar", key] as any[], cell);
                if (!val) {
                    result[key] = cssvars[key];
                }
            })
            // 宽度处理
            const key = `--ev-bw${pos}`;
            const val = driver.getValue("cell", ["cssvar", key] as any[], cell);
            if (innerExist) {
                // 有边框
                if (val === undefined || val === null) {
                    result[key] = cssvars[key];
                }
            } else if (val !== 0) {
                result[key] = 0;
            }
        });
    });
    return result;
}
/**
 * 获取单元格实际的四边归属
 */
export function getCellBorder(driver: EvDriver, cell: ICellKey, range: ICellRange, value: Partial<IGlobalBorderConfig>) {
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
    const { borderType, ...others } = value;
    const confs: IMultiRangeSetter = [];
    if (borderType) {
        // 当前节点在range内可以展示的边
        const pos = getCellBorderByPositon(driver, cell, range, borderType);
        borderKeys.map(key => {
            if (pos[key]) {
                (borders[key] || []).map(({ cell: cur, type }) => {
                    confs.push({ type: "cell", path: ["b" + type] as any[], value: true, range: [cur] });
                });// end cell map
            } else if (pos[key] === false && pos.clear) {
                (borders[key] || []).map(({ cell: cur, type }) => {
                    confs.push({ type: "cell", path: ["b" + type] as any[], value: false, range: [cur] });
                });// end cell map
            }
        })
    }

    // 其他值设值
    const map = { borderColor: "c", borderStyle: "s", borderWidth: "w" };
    Object.keys(others || {}).map(key => {
        Object.keys(borders).map(pos => {
            (borders[pos] || []).map(({ cell: cur, type }) => {
                confs.push({ type: "cell", path: ["cssvar", `--ev-b${map[key]}${type}` as any], value: others[key], range: cur });
            });// end cell map
        }) // end pos map
    })// end key map
    return confs;
}