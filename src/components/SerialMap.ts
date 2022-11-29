export default class SerialMap<T> {
    // 数组
    ary: T[] = [];
    // 序号映射
    keymap: Map<string, number> = new Map();
    // id字段
    keystr: string = "key";
    constructor(ary?: T[], key?: string) {
        this.ary = ary || [];
        this.keystr = key || "key";
        this.generateMap();
    }
    // 生成序号列表
    private generateMap() {
        this.keymap.clear();
        this.ary.map((item, idx) => this.keymap.set(item[this.keystr], idx));
    }
    // 从某个序号更新map
    private updateMap(fromIdx: number) {
        for (let i = fromIdx; i < this.ary.length; i++) {
            const item = this.ary[i];
            this.keymap.set(item[this.keystr], i)
        }
    }
    // 获得序号
    index(key: string) {
        const idx = this.keymap.get(key);
        return typeof (idx) === "number" ? idx : -1;
    }

    // 重置
    reset(ary: T[]) {
        this.ary = ary;
        this.generateMap();
    }
    // 清除
    clear() {
        this.ary = [];
        this.keymap.clear();
    }
    // 是否存在
    has(key: string) {
        return this.keymap.has(key);
    }
    // 获得key
    key(index: number) {
        return index < this.ary.length ? this.ary[index][this.keystr] : "";
    }
    // 获得单项
    item(keyOrIdx: string | number) {
        const idx = typeof (keyOrIdx) === "number" ? keyOrIdx : this.index(keyOrIdx);
        return idx < this.ary.length && idx >= 0 ? this.ary[keyOrIdx] : null;
    }
    // 大小
    size() {
        return this.keymap.size;
    }
    // 是否为空
    empty() {
        return this.keymap.size <= 0;
    }
    // 增加
    add(item: T) {
        this.ary.push(item);
        this.keymap.set(item[this.keystr], this.ary.length - 1);
    }
    // 删除
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
    // 插入
    insert(idx: number, ...items: T[]) {
        this.ary.splice(idx, 0, ...items);
        this.updateMap(idx);
    }
    // 插入在前面
    insertBefore(key: string, ...items: T[]) {
        const idx = this.index(key);
        if (idx >= 0) {
            this.insert(idx, ...items);
        }
    }
    // 插入在后面
    insertAfter(key: string, ...items: T[]) {
        const idx = this.index(key);
        if (idx >= 0) {
            this.insert(idx + 1, ...items);
        }
    }
    // 遍历
    mapNum(func, start: number, end: number) {
        start = Math.max(0, start);
        end = Math.max(0, end);
        let res: any[] = [];
        for (let i = start; i <= end; i++) {
            res.push(func(this.ary[i], i));
        }
        return res;
    }
    mapKey(func, startKey: string, endKey: string) {
        const start = this.index(startKey);
        const end = this.index(endKey);
        return start < end ? this.mapNum(func, start, end) : this.mapNum(func, end, start);
    }
    map(func) {
        return this.mapNum(func, 0, this.ary.length - 1);
    }
}