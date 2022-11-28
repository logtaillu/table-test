export default class SerialMap<T> {
    // 数组
    ary: T[] = [];
    // 序号映射
    keymap: Map<string, number> = new Map();
    // id字段
    key: string = "id";
    constructor(ary?: T[], key?: string) {
        this.ary = ary || [];
        this.key = key || "id";
        this.generateMap();
    }
    // 生成序号列表
    private generateMap() {
        this.keymap.clear();
        this.ary.map((item, idx) => this.keymap.set(item[this.key], idx));
    }
    // 从某个序号更新map
    private updateMap(fromIdx: number) {
        for (let i = fromIdx; i < this.ary.length; i++){
            const item = this.ary[i];
            this.keymap.set(item[this.key], i)
        }
    }
    // 重置
    set(ary: T[]) {
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
        this.keymap.set(item[this.key], this.ary.length - 1);
    }
    // 删除
    delete(key: string) {
        if (this.keymap.has(key)) {
            const idx = this.keymap.get(key);
            this.keymap.delete(key);
            if (typeof (idx) === "number" && idx >= 0) {
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
        const idx = this.keymap.get(key);
        if (typeof (idx) === "number" && idx >= 0) { 
            this.insert(idx, ...items);
        }
    }
    // 插入在后面
    insertAfter(key: string, ...items: T[]) {
        const idx = this.keymap.get(key);
        if (typeof (idx) === "number" && idx >= 0) { 
            this.insert(idx + 1, ...items);
        }
    }
}