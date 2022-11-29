/**
 * 参数合并，主要处理函数和object
 * @param current 当前项 
 * @param target 目标项
 * @returns 合并后的新object
 */
export function mergeConfig(col: any, target: any) {
    let res = { ...col };
    Object.keys(target).map(key => {
        const cur = target[key];
        if (typeof (cur) === "function" && res[key]) {
            const orifunc = res[key];
            res[key] = function (...args) {
                const originValue = orifunc(...args);
                return { ...originValue, ...cur(...args) };
            }
        } else if (res[key] && typeof (cur) === "object" && !Array.isArray(cur) && !('$$typeof' in cur) && !('$$typeof' in res[key])) {
            res[key] = mergeConfig(res[key], cur);
        } else {
            res[key] = cur;
        }
    })
    return res;
}

/**
 * 获取总深度
 * @param ary {T[]} 数组
 * @param childKey {string} 子数组字段名
 */
export function getDeep<T>(ary: T[], childKey: string = "children", deep = 0): number {
    if (ary && ary.length) {
        const startDeep = deep + 1;
        let maxDeep = startDeep;
        ary.map(item => {
            if (item && item[childKey] && item[childKey].length) {
                const childDeep = getDeep(item[childKey], childKey, startDeep);
                maxDeep = Math.max(maxDeep, childDeep);
            }
        })
        return maxDeep;
    } else {
        return deep;
    }

}

type IDeepMapHandle<T> = (params: { item: T, x: number, y: number, isLeaf: boolean, rowspan: number, colspan: number }) => Partial<T>;

/** 递归遍历数组
 * @param ary 数组
 * @param handle 处理函数
 * @param deep 总深度
 * @param childKey 子数组字段名
 * @returns {T[]} 处理后数组
 */
export function deepMapAry<T>(ary: T[], handle: IDeepMapHandle<T>, deep: number, childKey: string = "children"): T[] {
    const start = { x: 0, y: 0 };
    const recursionMapAry = (list, pos: { x, y }) => {
        return (list || []).map((item, index) => {
            if (item && item[childKey] && item[childKey].length) {
                const childpos = { y: pos.y + 1, x: pos.x };
                const children = recursionMapAry(item[childKey], childpos);
                const current = handle({
                    item, isLeaf: false, rowspan: 1,
                    colspan: childpos.x - pos.x + 1,
                    x: pos.x,
                    y: pos.y
                });
                pos.x = childpos.x + 1;
                return { ...mergeConfig(item, current), [childKey]: children };
            } else {
                const current = handle({
                    item, rowspan: deep - pos.y, isLeaf: true,
                    colspan: 'colSpan' in item && typeof (item["colSpan"]) === "number" ? item["colSpan"] : 1,
                    x: pos.x,
                    y: pos.y
                });
                pos.x += 1;
                return mergeConfig(item, current);
            }
        })
    }
    return recursionMapAry(ary, start);
}