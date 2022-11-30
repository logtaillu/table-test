/** 取值设值相关函数 */
import { ISaveValues } from "../../interfaces/IActionStack";

/**
 * 判空
 */
export function isEmpty(value: any) {
    return value === null || value === undefined;
}
/** 转数组 */
export function getAry(value: any) {
    return Array.isArray(value) ? value : [value];
}
/**
 * 判空取值
 * @param target 取值目标
 * @param paths 路径
 */
export function getValue(target: any, paths: string[] | string) {
    if (!Array.isArray(paths) && paths in target) {
        return target[paths];
    }
    paths = Array.isArray(paths) ? paths : paths.split(".").filter(s => !!s);
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
/** 取第一个存在值 */
export function getMergeValue(targets: any[], paths: string[] | string) {
    let res = undefined;
    for (let i = 0; i < targets.length; i++) {
        res = getValue(targets[i], paths);
        if (!isEmpty(res)) {
            break;
        }
    }
    return res;
}

/**
 * 按顺序取第一个能取到的有效值
 * @param target 取值目标
 * @param paths 路径列表
 * @returns 值
 */
export function getPriorityValue(targets: any | any[], paths: Array<string[] | string>) {
    let res = undefined;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].length) {
            const ary = getAry(targets);
            const current = getMergeValue(ary, paths[i]);
            if (!isEmpty(current)) {
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
export function getPriorityValueAry(targets: any | any[], paths: Array<string[] | string>): any[] {
    let res: any[] = new Array(paths.length).fill(null);
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].length) {
            const current = getMergeValue(getAry(targets), paths[i]);
            if (!isEmpty(current)) {
                res[i] = current;
            }
        }
    }
    for (let i = res.length - 2; i >= 0; i--) {
        if (isEmpty(res[i])) {
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
    values.map(({ value, path }) => {
        // 保存新值并获取旧值
        const oldValue = setValue(target, path, value);
        // 如果2个值不等，保存旧值
        if (oldValue !== value) {
            saveTarget.push({ value: oldValue, path });
        }
    });
    return saveTarget;
}