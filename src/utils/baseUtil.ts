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