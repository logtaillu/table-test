export default class SerialMap<T> {
    /** 数据数组 */
    ary: T[] = [];
    /** 序号映射 */
    keymap: Map<string, number> = new Map();
    /** key字段 */
    keystr: string = "";
    constructor(ary?: T[], key?: string) {
        this.ary = ary || [];
        this.keystr = key || "";
        this.generateMap();
    }
    /** 获取key */
    private getkey(item: T) {
        return this.keystr && item && typeof (item) === "object" ? item[this.keystr] : item;
    }
    /** 重构序号列表 */
    private generateMap() {
        this.keymap.clear();
        this.ary.map((item, idx) => this.keymap.set(this.getkey(item), idx));
    }
    /** 从某个序号开始重置 */
    private updateMap(fromIdx: number) {
        for (let i = fromIdx; i < this.ary.length; i++) {
            const item = this.ary[i];
            this.keymap.set(this.getkey(item), i)
        }
    }
    /** 获取key对应的序号 */
    index(key: string) {
        const idx = this.keymap.get(key);
        return typeof (idx) === "number" ? idx : -1;
    }

    /** 重置 */
    set(ary?: T[]) {
        this.ary = ary || [];
        this.generateMap();
    }
    /** 清除 */
    clear() {
        this.ary = [];
        this.keymap.clear();
    }

    /** key是否存在 */
    has(key: string) {
        return this.keymap.has(key);
    }
    /** 根据序号获取key */
    key(index: number) {
        return index < this.ary.length ? this.getkey(this.ary[index]) : "";
    }
    // 获得单项
    item(keyOrIdx: string | number) {
        const idx = typeof (keyOrIdx) === "number" ? keyOrIdx : this.index(keyOrIdx);
        return idx < this.ary.length && idx >= 0 ? this.ary[keyOrIdx] : null;
    }
    /** 数组大小 */
    size() {
        return this.keymap.size;
    }
    // 是否为空
    empty() {
        return this.keymap.size <= 0;
    }
    /** 添加项 */
    push(item: T) {
        this.ary.push(item);
        this.keymap.set(this.getkey(item), this.ary.length - 1);
    }
    /** 用key删除项 */
    delete(key: string) {
        if (this.keymap.has(key)) {
            const idx = this.index(key);
            this.keymap.delete(key);
            if (idx >= 0) {
                this.ary.splice(idx, 1);
                this.updateMap(idx);
            }
        }
    }
    /** 删除项 */
    remove(item: T) {
        const key = this.getkey(item);
        if (key) {
            this.delete(key);
        }
    }
    /** 插入项 */
    insert(idx: number, ...items: T[]) {
        this.ary.splice(idx, 0, ...items);
        this.updateMap(idx);
    }
    /** 插入在前面 */
    insertBefore(key: string, ...items: T[]) {
        const idx = this.index(key);
        if (idx >= 0) {
            this.insert(idx, ...items);
        }
    }
    /** 插入在后面 */
    insertAfter(key: string, ...items: T[]) {
        const idx = this.index(key);
        if (idx >= 0) {
            this.insert(idx + 1, ...items);
        }
    }
    /** 根据序号区间遍历 */
    mapNum(func, start: number, end: number) {
        start = Math.max(0, start);
        end = Math.min(Math.max(start, end), this.size());
        let res: any[] = [];
        if (start >= this.size()) {
            return res;
        }
        for (let i = start; i <= end; i++) {
            res.push(func(this.ary[i], i));
        }
        return res;
    }
    /** 根据key区间遍历 */
    mapKey(func, startKey: string, endKey: string) {
        const start = this.index(startKey);
        const end = this.index(endKey);
        return start < end ? this.mapNum(func, start, end) : this.mapNum(func, end, start);
    }
    /** 完整遍历 */
    map(func) {
        return this.mapNum(func, 0, this.ary.length - 1);
    }
}