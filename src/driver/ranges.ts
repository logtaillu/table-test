// 范围设值操作

import EvDriver from "./EvDriver";
import { IValueType, IRangeType, ICellRange, ICellKey, IRangeAryType } from "../interfaces/IGlobalType";
import { IConfigKey } from "../interfaces/IDriverCache";
import { getRangeCellList, getTargetRangeList } from "../utils/rangeUtil";
import { getCellTypeKey } from "../utils/keyUtil";
import { getPriorityValue, getValue, setAndSaveValues } from "../utils/valueUtil";
import { ISaveValues } from "../interfaces/IActionStack";

/** 设值，不包含external类型的cell */
export function getRangeValue(driver: EvDriver, type: IValueType, path: IConfigKey[], range: IRangeAryType) {
    if (type === "wrap") {
        // 全局参数
        return getValue(driver.content, path);
    }
    const ranges = range ? getTargetRangeList(driver, range) : driver.content?.selected || [];
    let grange = driver.globalRange;
    if (ranges.length) {
        // 选择范围处理
        const list = getRangeCellList(ranges, driver.merged, driver.content?.deep || 0);
        const getCellValue = (cell: ICellKey) => {
            return getPriorityValue(driver.content, [
                [type, getCellTypeKey(cell, type), ...path],
                [cell.type, type, ...path],
                ["all", type, ...path]
            ]);
        }
        // 是否所有单元格值相同
        const firstValue = getCellValue(list[0]);
        const nosameValue = list.findIndex(cell => getCellValue(cell) !== firstValue) >= 0;
        if (nosameValue) {
            // 如果类型相同，那么优先当前类型的值
            const nosameType = list.findIndex(cell => cell.type !== list[0].type) >= 0;
            grange = nosameType ? "all" : list[0].type as any;
        } else {
            // 值全部相同
            return firstValue;
        }
    }
    if (grange === "all") {
        return getValue(driver.content, [grange, type, ...path]);
    } else {
        return getPriorityValue(driver.content, [
            [grange, type, ...path],
            ["all", type, ...path]
        ]);
    }
}
/** 取值 */
export function setRangeValue(driver: EvDriver, type: IValueType, path: IConfigKey[], value: any, range: IRangeAryType = false, clearKeys: Array<IConfigKey[]> = []): ISaveValues {
    const ranges = range ? getTargetRangeList(driver, range) : driver.content?.selected || [];
    const saves: ISaveValues = [];
    if (ranges.length > 0) {
        const list = getRangeCellList(ranges, driver.merged, driver.content?.deep || 0);
        list.map(cell => {
            saves.push({ value, paths: [type, getCellTypeKey(cell, type), ...path] });
        });
    } else {
        const globalRange = type === "col" ? "all" : driver.globalRange;
        saves.push({ value, paths: [globalRange, type, ...path] });
        // 清除下层
        if (globalRange === "all") {
            saves.push({ value: undefined, paths: ["header", type, ...path] });
            saves.push({ value: undefined, paths: ["body", type, ...path] });
        }
        // 遍历当前type的key值，清除范围内的
        const target = getValue(driver.content, type) || {};
        Object.keys(target).map(typekey => {
            // col不区分body/header，col只有global
            if (driver.globalRange === "all" || type === "col" || typekey.includes(driver.globalRange)) {
                saves.push({ value, paths: [type, typekey, ...path] });
                clearKeys.map(key => {
                    const paths = Array.isArray(key) ? key : [key];
                    saves.push({ value, paths: [type, typekey, ...paths] });
                })
            }
        });
    }
    const saveTarget = setAndSaveValues(driver.content, saves);
    return saveTarget;
}