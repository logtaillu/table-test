import SerialMap from "./SerialMap";

/**
 * 1. 分类数组
 * 2. 序号查找
 */
export default class ClassifyAry<T>{
    private data: Map<string, SerialMap<T>> = new Map();
    /** key字段 */
    private keystr: string = "";
    /** 连接符 */
    private symbol: string = "-";
    constructor(data?: Array<[string, T[]]>, key?: string, symbol?: string) {
        this.keystr = key || "";
        this.symbol = symbol || "-";
        this.set(data);
    }
    /** 重置 */
    set(data?: Array<[string, T[]]>) {
        this.data.clear();
        (data || []).map(([type, ary]) => {
            this.data.set(type, new SerialMap(ary, this.keystr));
        });
    }
    private mapAndBreak(handle) {
        const keys = this.data.keys();
        const cur = keys.next();
        while (!cur.done) {
            const target = this.data.get(cur.value);
            const result = handle(target, cur.value);
            if (result === true) {
                break;
            }
        }
    }

    /**用序号查找key*/
    key(index: number) {
        let start = 0;
        let key = "";
        let type = "";
        this.mapAndBreak((target: SerialMap<T>, t) => { 
            const size = target && target.size() || 0;
            if (start + size <= index) {
                start += size;
            } else {
                key = target.key(index - start);
                type = t;
                return true;
            }
        });
        return key && type ? { key, type } : null;
    }
    /** 用序号在类型内查找 */
    typeKey(type: string, index: number) {
        const target = this.data.get(type);
        return target ? target.key(index) : "";
    }
    /** 最后一个 */
    lastKey() {
        let target: any = null;
        let type: string = "";
        this.mapAndBreak((cur: SerialMap<T>, t) => {
            target = cur;
            type = t;
        });
        return target && target.size() ? {
            type,
            key: target.key(target.size() - 1)
        } : null;
    }
    /** 类型内最后一个 */
    typeLastKey(type: string) {
        const target = this.data.get(type);
        return target && target.size() ? target.key(target.size() - 1) : "";
    }
     /** 总容量 */
    size() {
        let size = 0;
        this.mapAndBreak(target => {
            const cur = target ? target.size() : 0;
            size += cur;
        });
        return size;
    }
    /** 类型总容量 */
    typeSize(type: string) {
        const target = this.data.get(type);
        return target ? target.size() : 0;
    }

}