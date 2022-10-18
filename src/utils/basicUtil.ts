/**
 * 判空取值
 * @param paths 路径
 * @param target 取值目标
 */
export const getValue = (paths: string[] | string, target: any) => {
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
 * 判空设置值
 * @param paths 路径
 * @param target 设值目标
 * @param value 值
 */
export const setValue = (paths: string[], target: any, value: any) => {
    const len = paths.length;
    paths.map((p, idx) => {
        if (idx === len - 1) {
            target[p] = value;
        } else {
            p = p.toString();
            const isArray = p.startsWith("ary");
            const realP = p.replace(/^ary/, "");
            target[realP] = target[realP] || (isArray ? [] : {});
            target = target[realP];
        }
    });
}