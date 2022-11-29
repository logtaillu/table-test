/** 内容store */
import { makeAutoObservable } from "mobx";
import SerialMap from "../../components/SerialMap";
import { IBodyRow, IDriverCache } from "../../interfaces/IDriverCache";
import { IRenderCol, ITableProps } from "../../interfaces/ITableProps";
import EvDriver from "../EvDriver";
import { getInitCache, mergeByTarget } from "./init";
export default class ContentStore {
    driver: EvDriver;
    constructor(driver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
    /** 缓存内容 */
    content: IDriverCache = {};
    /** 层叠columns */
    columns: IRenderCol[][] = [];
    /** 底层columns */
    flatCols: SerialMap<IRenderCol> = new SerialMap();
    /** 当前行缓存 */
    brows: SerialMap<IBodyRow> = new SerialMap();
    /** 获取表头深度 */
    get deep() {
        return this.columns.length;
    }
    /** 设置content */
    set cache(content: IDriverCache | undefined) {
        mergeByTarget(content || {}, getInitCache());
        this.content = content || {};
        this.driver.action.actionStack = [];
        this.driver.action.undoStack = [];
    }
    /** 设置column */
    set column(columns:ITableProps["columns"]) {
        
    }
    /** 设置data */
    set data(data: ITableProps["data"]) {
        
    }
}