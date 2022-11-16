/** 取值设值相关函数 */
import { ISaveValues } from "../interfaces/IActionStack";

/**
 * 判空取值
 * @param target 取值目标
 * @param paths 路径
 */
export function getValue(target: any, paths: string[] | string) {
    paths = Array.isArray(paths) ? paths : paths.split(".");
    let cur = target;
    if (!cur) {
        return cur;
    }
    for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        cur = cur[p];
        if (!cur) {
            break;
        }
    }
    return cur;
}

/**
 * 按顺序取第一个能取到的有效值
 * @param target 取值目标
 * @param paths 路径列表
 * @returns 值
 */
export function getPriorityValue(target: any, paths: Array<string[] | string>) {
    let res = undefined;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].length) {
            const current = getValue(target, paths[i]);
            if (current !== null && current !== undefined) {
                res = current;
                break;
            }
        }
    }
    return res;
}

/**
 * 按顺序返回每级的有效值
 * @param target 取值目标
 * @param paths 路径列表
 * @returns 值
 */
export function getPriorityValueAry(target: any, paths: Array<string[] | string>): any[] {
    let res: any[] = new Array(paths.length).fill(null);
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].length) {
            const current = getValue(target, paths[i]);
            if (current !== null && current !== undefined) {
                res[i] = current;
            }
        }
    }
    for (let i = res.length - 2; i--; i >= 0){
        if (res[i] === null || res[i] === undefined) {
            res[i] = res[i + 1];
        }
    }
    return res;
}
/**
 * 判空设置值
 * @param target 设值目标
 * @param paths 路径
 * @param value 值
 * @returns oldValue 旧值
 */
export function setValue(target: any, paths: string[], value: any) {
    const len = paths.length;
    let oldValue = undefined;
    paths.map((p, idx) => {
        if (idx === len - 1) {
            oldValue = target[p];
            if (value === undefined) {
                if (p in target) {
                    delete target[p];
                }
            } else {
                target[p] = value;
            }
        } else {
            p = p.toString();
            const isArray = p.startsWith("ary");
            const realP = p.replace(/^ary/, "");
            target[realP] = target[realP] || (isArray ? [] : {});
            target = target[realP];
        }
    });
    return oldValue;
}
/**
 * 保存值并返回保存对象
 * @param target 
 * @param values 
 * @returns saveTarget 旧值对象
 */
export function setAndSaveValues(target: any, values: ISaveValues) {
    const saveTarget: ISaveValues = [];
    values.map(({ value, paths }) => {
        // 保存新值并获取旧值
        const oldValue = setValue(target, paths, value);
        // 如果2个值不等，保存旧值
        if (oldValue !== value) {
            saveTarget.push({ value: oldValue, paths });
        }
    });
    return saveTarget;
}