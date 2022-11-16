// 范围设值操作
// 值层级(每个type)
// wrap : global
// row : all => body/header => row
// cell : all => body/header => body/header(col) => body/header(cell)
// col : all => col
// colcell: col层cell
import EvDriver from "./EvDriver";
import { IValueType, ICellKey, IRangeAryType, IGlobalRange, IRangeType, IColKey } from "../interfaces/IGlobalType";
import { IConfigKey } from "../interfaces/IDriverCache";
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

/** 取值，按优先级获取值 */
export function getRangeValue(driver: EvDriver, type: IValueType, path: IConfigKey[], range: IRangeAryType) {
    if (type === "wrap") {
        return getValue(driver.content, path);
    } else {
        return getSelectRangeValue(range, driver, type, path);
    }
}





/** 获取单元格不同类型的取值路径
 *  @param type 类型
 * @param cell 单元格
 * @returns {string[][]} 优先级取值路径
 */
function getCellValuePath(type: IValueType, path: IConfigKey[], grange: IGlobalRange, cell?: ICellKey): string[][] {
    // all类型，总是存在
    const allpath = ["all", type, ...path];
    // 最内层，有cell的时候才有
    const typepath = cell ? [type, getCellTypeKey(cell, type), ...path] : [];
    // body/header类型，有cell或者grange !==all时存在
    const bodyHeaderPath = cell ? [cell.type, type, ...path] : grange === "all" ? [] : [grange, type, ...path];
    const gtype = cell ? cell.type : grange;
    if (type === "row") {
        return [typepath, bodyHeaderPath, allpath].filter(s => s.length > 0);
    } else if (type === "col") {
        return [typepath, allpath].filter(s => s.length > 0);
    } else if (type === "cell") {
        return [
            typepath, // cell
            // col内cell配置
            cell ? ["col", getCellTypeKey(cell, "col"), "cell", ...path] : [], // col
            bodyHeaderPath, // body/header
            allpath // all
        ].filter(s => s.length > 0);
    } else {
        return [];
    }
}

/** 获取范围内的值 */
function getSelectRangeValue(range: IRangeAryType, driver: EvDriver, type: IValueType, path: IConfigKey[]) {
    const { list, grange } = getCellListandGlobalRange(driver, range);
    if (list.length) {
        const getCellValueList = (cell?: ICellKey) => {
            // 层级取值
            const getvalpath = getCellValuePath(type, path, grange, cell);
            return getPriorityValueAry(driver.content, getvalpath);
        }
        // 是否所有单元格值相同，取第一个单元格的值
        if (list.length) {
            const listvalues = list.map(cell => getCellValueList(cell));
            const firstValue = listvalues[0];
            // 找到第一个所有cell相同的，最后一层是all，总是全部相同
            const targetValue = firstValue.find((v, idx) => {
                const nosame = listvalues.findIndex(vary => vary[idx] !== v);
                return nosame < 0;
            });
            return targetValue;
        }
    } else {
        // 根据取值路径取全局优先级值
        const getvalpath = getCellValuePath(type, path, grange);
        return getPriorityValue(driver.content, getvalpath);
    }
}
/**
 * 获取设值列表 
 * @param list 单元格列表或者类型key列表
 * @param value 值
 * @param type 类型
 * @param path 路径列表
 * @returns 
 */
function getValueSetList(saves: ISaveValues, list: Array<ICellKey | string>, value: any, type: IValueType, path: IConfigKey[][]) {
    const keymap: any = {};
    list.map(cell => {
        const key = typeof (cell) === "string" ? cell : getCellTypeKey(cell, type);
        if (!keymap[key]) {
            keymap[key] = true;
            path.map(p => {
                saves.push({ value, paths: [type, key, ...p] });
            });
        }
    });
}

/** 特殊的对于cell，range排除colslist */
function getColKeys(range: IRangeAryType): IColKey[] {
    const iscol = (r: IRangeType) => typeof (r) === "object" && 'col' in r && !('row' in r) && !('type' in r);
    if (Array.isArray(range)) {
        const idx = range.findIndex(s => !iscol(s));
        return idx >= 0 ? [] : range as IColKey[];
    } else {
        return iscol(range) ? [range] as IColKey[] : [];
    }
}

/** 设值，设置当前值并清除下层值 */
export function setRangeValue(driver: EvDriver, type: IValueType, path: IConfigKey[], value: any, range: IRangeAryType = false, clearKeys: Array<{ type: IValueType, path: IConfigKey[] }> = []): ISaveValues {
    const saves: ISaveValues = [];
    if (type === "wrap") {
        // 整体量，虽然一般不会走这里
        saves.push({ value, paths: path });
    } else {
        const { list, grange } = getCellListandGlobalRange(driver, range);
        const getKeys = t => {
            const keys = Object.keys(getValue(driver.content, t) || {});
            return keys.filter(k => grange === "all" || t === "col" || k.includes(t));
        };
        // list判断
        const commonSet = (handle) => {
            if (list.length) {
                getValueSetList(saves, list, value, type, [path]);
            } else {
                handle();
                // 清除最内层
                getValueSetList(saves, getKeys(type), undefined, type, [path]);
            }
        }
        // 全局设值
        const setGlobal = () => {
            if (grange === "all") {// 设在all，清除body/header
                saves.push({ value, paths: ["all", type, ...path] });
                saves.push({ value: undefined, paths: ["header", type, ...path] });
                saves.push({ value: undefined, paths: ["body", type, ...path] });
            } else {//设在body/header
                saves.push({ value, paths: [grange, type, ...path] });
            }
        }
        if (type === "row") {
            commonSet(setGlobal);
        } else if (type === "col") {
            commonSet(() => saves.push({ value, paths: ["all", type, ...path] }));
        } else if (type === "cell") {
            const colkeys = getColKeys(range);
            if (colkeys.length) {
                // col类型
            } else {
                commonSet(() => {
                    setGlobal(); // 全局设值
                    getValueSetList(saves, getKeys("col"), undefined, "col", [["cell", ...path]]); // 清除col
                })
            }
        }
    }
    const saveTarget = setAndSaveValues(driver.content, saves);
    return saveTarget;
}