/** 内容store */
import { makeAutoObservable } from "mobx";
import { IDriverCache } from "../../interfaces/IDriverCache";
import { IRowKey } from "../../interfaces/IGlobalType";
import { IRenderCol } from "../../interfaces/ITableProps";
import EvDriver from "../EvDriver";

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
    get deep() {
        return this.columns.length;
    }
}