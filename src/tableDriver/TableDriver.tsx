/**
 * table操作配置缓存及操作栈管理
 * 每个table有自己的driver
 */
import { makeAutoObservable, observable, action, computed } from "mobx"
import { IActionStack, ITableCacheConfig, IAcitonServiceMap, IActionItem, ICellRange, ICellKey } from "./ITableDriver"
import { getCellKey, getCellRelationToRange, getColKey, getFormatedRange, getRangeCells, getRangeRelation, getRowKey } from "./DriverFunc";
import { ITableService } from "../services/ITableService";
import eventUtil from "../utils/eventUtil";
export type IGlobalRange = "body" | "header" | "all";
export interface ISettableProps {
    config?: ITableCacheConfig
    prefixCls?: string;
    lang?: string;
    editable?: boolean;
    globalRange?: IGlobalRange;
    headerDeep?: number;
}
const defaultConfig: () => ITableCacheConfig = () => ({});
export default class TableDriver {
    /*******************常量定义 **********************/
    // 操作栈
    actionStack: IActionStack = [];
    // 回退了的操作
    undoStack: IActionStack = [];
    // 是否正在选择范围
    selecting: boolean = false;
    // 配置集合
    config: ITableCacheConfig = {};
    // 操作
    actionMap: IAcitonServiceMap = {};
    // 样式前缀
    prefixCls: string = "extable";
    // 语言
    lang: string = "zh-CN";
    // 编辑状态
    editable: boolean = false;
    // 表格元素
    tableRef: HTMLDivElement | null = null;
    // 当前的全局设置维度
    globalRange: IGlobalRange = "body";
    // 缓存，表头行数
    headerDeep: number = 0;
    // 构造函数
    constructor(props: ISettableProps) {
        makeAutoObservable(this, {
            tableRef: observable.ref
        });
        this.range = props.globalRange;
        this.conf = props.config;
        this.language = props.lang;
        this.cls = props.prefixCls;
        this.deep = props.headerDeep;
        this.edit = props.editable;
    }
    getRangeRelation = getRangeRelation;
    getCellKey = getCellKey;
    getRowKey = getRowKey;
    getColKey = getColKey;
    // 存储动作
    set range(val: IGlobalRange | undefined) {
        if (val) {
            this.globalRange = val
        }
    };
    // 设置config同时清空操作栈
    set conf(val: ITableCacheConfig | undefined) {
        this.actionStack = [];
        this.undoStack = [];
        this.config = val || defaultConfig();
    };
    set language(val: string | undefined) { val && (this.lang = val) };
    set cls(val: string | undefined) { val && (this.prefixCls = val) };
    set deep(val: number | undefined) { val && (this.headerDeep = val) };
    set edit(val: boolean | undefined) { this.editable = !!val };

    // 简易的样式前缀补充函数
    prefix = (cls: string = "") => {
        return cls.length ? cls.split(" ").filter(s => !!s).map(s => this.prefixCls + "-" + s).join(" ") : this.prefixCls;
    }

    // 注册动作和事件
    register(services: ITableService[]) {
        services.map(service => {
            const { actions = {}, events = [] } = service;
            if (actions) {
                Object.keys(actions).map(key => {
                    this.actionMap[key] = actions[key];
                });
            }
            eventUtil.addEvents(this, events);
        });
    }
    // 移除事件，动作不动，后面可以覆盖
    remove() {
        eventUtil.removeEvents(this);
    }
    /************************action操作 ***********************************/

    // 执行操作，并根据需要清除重做栈
    doAction(action: IActionItem, clearUndo: boolean = true) {
        const service = this.actionMap[action.type];
        if (service) {
            const result = service.exec(this, action.value);
            if (result === false) {
                return;
            }
            console.log("do action", action.type);
            // 有undo功能的action，入栈
            if (service.undo) {
                this.actionStack.push(action);
                if (clearUndo) {
                    this.undoStack = [];
                }
            }
        }
    }
    // 外部使用的执行操作
    exec(type: string, value?: any) {
        this.doAction({ type, value });
    }
    // 重做
    redoAction() {
        if (this.undoStack.length) {
            const nextAction = this.undoStack.pop();
            if (nextAction) {
                this.doAction(nextAction, false);
            }

        }
    }
    // 回退
    undoAction() {
        if (this.actionStack.length) {
            const lastAction = this.actionStack.pop();
            if (lastAction && this.actionMap[lastAction.type]) {
                console.log("undo action", lastAction.type);
                this.undoStack.push(lastAction);
                const func = this.actionMap[lastAction.type].undo;
                func && func(lastAction.value, this);
            }
        }
    }

    // 空栈判断
    get undoEnable() {
        return this.actionStack.length > 0;
    }

    get redoEnable() {
        return this.undoStack.length > 0;
    }
    /************************范围(range)操作 ********************************/
    // 获取格式化的选择范围
    get selectedRanges(): ICellRange[] {
        return (this.config.selected || []).map(range => getFormatedRange(range));
    }
    // 获取格式化的合并范围
    get mergedRanges(): ICellRange[] {
        return (this.config.merged || []).map(range => getFormatedRange(range));
    }
    // 获取右下角的合并单元格处理后的range，返回格式化range
    getRangeHandleMerged(range: ICellRange, useMerged: boolean): ICellRange {
        const merged = this.config.merged || [];
        let { from, to } = getFormatedRange(range);
        // 考虑非最小格的情况，找到包含右下角的
        const target = merged.find(current => {
            return getCellRelationToRange(to, current) !== "out";
        });
        if (target) {
            const trange = getFormatedRange(target);
            to = useMerged ? trange.from : trange.to;
        }
        return { from, to };
    }

    // 只有在展示时使用，需要用合并后的单元格，对于右下角，需要转换
    get selectedShowRanges() {
        return (this.config.selected || []).map(range => {
            return this.getRangeHandleMerged(range, true);
        });
    }

    // 获取当前范围内的单元格[最小格]
    getCellListInRange(range: ICellRange): ICellKey[] {
        const minCellRange = this.getRangeHandleMerged(range, false);
        return getRangeCells(minCellRange, this.headerDeep);
    }
    // 1. 范围优先级：selecRange => all/body/header
    // 2. 值优先级：cells/rows/cols=>body/header
    // 范围取值（展示）
    getRangeValue(key: string, type: "col" | "row" | "cell") {
        const selected = this.config.selected || [];
        if (selected.length) {
            // 有选择范围，根据选择范围来设置
        } else {
            const globalRange = this.globalRange;
            // 没有选择范围，根据globalRange来
        }
    }
    // 范围设置值（保存）
    setRangeValue(key: string, type: "col" | "row" | "cell", value: any) {

    }

    /************************事件相关 ********************************/
    /**是否目标table */
    isEventTarget(e: any) {
        const wrapper = e.target?.closest(`div.${this.prefix("inner-table")}`);
        return wrapper === this.tableRef;
    }
}