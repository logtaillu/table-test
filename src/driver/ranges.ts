// 范围设值操作
// 值层级(每个type)
// wrap : global
// row : all => body/header => row
// cell : all => body/header => body/header(col) => body/header(cell)
// col : all => col
// colcell: col层cell，取值all => body/header => body/header(col)，设值body/header(col) => body/header(cell)
import EvDriver from "./EvDriver";
import { IValueType, ICellKey, IRangeAryType, IGlobalRange, IRangeType, IColKey } from "../interfaces/IGlobalType";
import { IClearKeys, IConfigKey } from "../interfaces/IDriverCache";
import { getRangeCellList, getTargetRangeList } from "../utils/rangeUtil";
import { getCellTypeKey } from "../utils/keyUtil";
import { getPriorityValue, getPriorityValueAry, getValue, setAndSaveValues } from "../utils/valueUtil";
import { ISaveValues } from "../interfaces/IActionStack";
/** 获取当前的cell list和全局范围  */
function getCellListandGlobalRange(driver: EvDriver, range: IRangeAryType) {
    if (typeof (range) === "string") { // 不转化全局类型
        return { list: [], grange: range };
    } else {
        const ranges = range ? getTargetRangeList(driver, range) : driver.content?.selected || [];
        const list = getRangeCellList(ranges, driver.merged, driver.content?.deep || 0);
        return { list, grange: driver.globalRange };
    }
}

/** 获取取值路径列表 */
function getPathListGet(driver: EvDriver, type: IValueType, path: IConfigKey[], range: IRangeAryType) {
    const { list, grange } = getCellListandGlobalRange(driver, range);
    const result: string[][][] = [];
    if (type === "wrap") {
        result.push([path]);
    } else { // row, col, cell, colcell
        const valType = type === "colcell" ? "cell" : type;
        const allpath = ["all", valType, ...path];
        if (list.length) {
            list.map(cell => {
                result.push([
                    // inner, colcell没有
                    type === "colcell" ? [] : [valType, getCellTypeKey(cell, type), ...path],
                    // col cell，2种cell有
                    ["cell", "colcell"].includes(type) ? ["col", getCellTypeKey(cell, "col"), "cell", ...path] : [],
                    // body/header，col没有
                    type === "col" ? [] : [cell.type, valType, ...path],
                    // all，都有
                    allpath
                ].filter(s => s.length > 0));
            })
        } else if (grange === "all" || type === "col") {
            result.push([allpath]);
        } else {
            result.push([[grange, valType, ...path], allpath]);
        }
    }
    return result;
}

/** 取值，按优先级获取值 */
export function getRangeValue(driver: EvDriver, type: IValueType, path: IConfigKey[], range: IRangeAryType) {
    const paths = getPathListGet(driver, type, path, range);
    // 是否所有单元格值相同，取第一个单元格的值
    if (paths.length) {
        const listvalues = paths.map(pary => getPriorityValueAry(driver.content, pary));
        const firstValue = listvalues[0];
        // 找到第一个所有cell相同的，最后一层是all，总是全部相同
        const targetValue = firstValue.find((v, idx) => {
            const nosame = listvalues.findIndex(vary => vary[idx] !== v);
            return nosame < 0;
        });
        return targetValue;
    }
    return undefined;
}

/**
 * 获取设值列表 
 * @param target 保存目标
 * @param list key列表
 * @param value 值
 * @param prefix 第一路径
 * @param path 路径列表
 * @returns {void}
 */
function getValueSetList(target: ISaveValues, list: string[], value: any, prefix: string, path: IConfigKey[], otherkeys: IClearKeys = []) {
    const pary: string[][] = [];
    otherkeys.map(c => {
        if (c.type === prefix) {
            pary.push(c.path);
        }
    });
    const keymap: any = {};
    list.map(key => {
        if (!keymap[key]) {
            keymap[key] = true;
            target.push({ value, path: [prefix, key, ...path] });
            pary.map(p => {
                target.push({ value: undefined, path: [prefix, key, ...p] });
            });
        }
    });
}

/** 设值，设置当前值并清除下层值 */
export function setRangeValue(driver: EvDriver, type: IValueType, path: IConfigKey[], value: any, range: IRangeAryType = false, clearKeys: Array<{ type: IValueType, path: IConfigKey[] }> = []): ISaveValues {
    const result: ISaveValues = [];
    const { list, grange } = getCellListandGlobalRange(driver, range);
    if (type === "wrap") {
        result.push({ value, path });
    } else if (type === "row" || type === "col") { // row, col
        const setValue = (list: string[], value: any, prefix: string) => getValueSetList(result, list, value, prefix, path, clearKeys);
        if (list.length) {
            const keys = list.map(cell => getCellTypeKey(cell, type));
            setValue(keys, value, type);
        } else {
            const isCol = type === "col";
            const valRange = isCol ? "all" : grange;
            // 当前层级
            result.push({ value, path: [valRange, type, ...path] });
            // body/header层级 for all, col没有这个类型
            if (valRange === "all" && !isCol) {
                ["body", "header"].map(t => setValue([type], undefined, t));
            }
            // inner层级
            const keys = Object.keys(getValue(driver.content, type) || {}).filter(s => valRange === "all" || s.includes(grange));
            setValue(keys, undefined, type);
        }
    }
    // return
    const saveTarget = setAndSaveValues(driver.content, result);
    return saveTarget;
}