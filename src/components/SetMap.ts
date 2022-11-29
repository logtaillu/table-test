export default class SetMap<T>{
    keymap: Map<string, Set<T>> = new Map();
    constructor(map?: Array<[string, T[]]>) {
        this.reset(map);
    }
    // 重置
    reset(map?: Array<[string, T[]]>) {
        const temp = new Map();
        map?.map(([key, ary]) => {
            temp.set(key, new Set(ary));
        })
        this.keymap = temp;
    }
    // 添加
    push(key: string, item: T) {
        const ary = this.keymap.get(key);
        if (ary) {
            ary.add(item);
        } else {
            this.keymap.set(key, new Set([item]));
        }
    }
    // 删除
    delete(key: string, item: T) {
        if (this.keymap.has(key)) { 
            const ary = this.keymap.get(key);
            ary?.delete(item);
        }
    }
    // 单个类型遍历
    map(key, func) {
        if (this.keymap.has(key)) {
            const ary = this.keymap.get(key);
            ary?.forEach((value) => {
                func(value);
            })
        }
    }
    // key遍历
    forEach(func) {
        this.keymap.forEach((value, key) => {
            func(value, key);
        })
    }
    // 是否存在key
    has(key: string) {
        return this.keymap.has(key);
    }
    clear() {
        this.keymap.clear();
    }
}