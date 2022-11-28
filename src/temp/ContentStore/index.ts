/** 内容store */
import { makeAutoObservable } from "mobx";
import { IDriverCache } from "../../interfaces/IDriverCache";
import { IRenderCol } from "../../interfaces/ITableProps";
import EvDriver from "../EvDriver";
import { getInitCache, mergeByTarget } from "./init";

export default class ContentStore {
    driver: EvDriver;
    constructor(driver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
    content: IDriverCache = {};
    /** 层叠columns */
    columns: IRenderCol[][] = [];
    /** 底层columns */
    flatCols: IRenderCol[] = [];
    /** 列映射 */
    colKeyMap: Map<string, number> = new Map();
    /** 行映射 */
    rowKeyMap: Map<string, number> = new Map();
    /** 行列表[body部分] */
    rows: Array<{
        key: string,
        record?: any
    }> = [];
    // 表头深度
    get deep() {
        return this.columns.length;
    }
    // 设置content
    set cache(content: IDriverCache | undefined) {
        mergeByTarget(content || {}, getInitCache());
        this.content = content || {};
        this.driver.action.actionStack = [];
        this.driver.action.undoStack = [];
    }
}