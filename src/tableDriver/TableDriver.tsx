/**
 * table操作配置缓存及操作栈管理
 * 每个table有自己的driver
 */
import { makeAutoObservable, observable } from "mobx"
import { IActionStack, ITableCacheConfig, IAcitonServiceMap, IActionItem, ICellRange, ICellKey, IGlobalRange, IValueType, IConfigKey, IRowKey, IColKey, ISaveValues, IRangeSetAry, ISaveRange } from "./ITableDriver"
import { getFormatedRange, getRangeCells, getRangeHandleMerged, getRangeRelation, getTargetRange } from "./DriverFunc";
import { getPriorityValue, getValue, setAndSaveValues } from "./ValueFunc";
import { ITableService } from "../services/ITableService";
import eventUtil from "../utils/eventUtil";
import { getCellTypeKey, getColKey, getCellKey, getRowKey } from "./keyFunc";
import { mergeConfig } from "../utils/columnUtil";
import { getDefaultConfig } from "./getDefaultConfig";
export interface ISettableProps {
    config?: ITableCacheConfig
    prefixCls?: string;
    lang?: string;
    editable?: boolean;
    globalRange?: IGlobalRange;
    headerDeep?: number;
}
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
    globalRange: IGlobalRange = "all";
    // 缓存，表头行数
    headerDeep: number = 0;
    // 构造函数
    constructor(props: ISettableProps) {
        makeAutoObservable(this, {
            tableRef: observable.ref
        });
        this.range = props.globalRange;
        this.content = props.config;
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
    setConfigValue(key: string, value: any) {
        this.config[key] = value;
    }
    // 设置config同时清空操作栈
    set content(val: ITableCacheConfig | undefined) {
        this.actionStack = [];
        this.undoStack = [];
        this.config = mergeConfig(getDefaultConfig(), val);
    };
    set language(val: string | undefined) { val && (this.lang = val) }
    set cls(val: string | undefined) { val && (this.prefixCls = val) }
    set deep(val: number | undefined) { val && (this.headerDeep = val) }
    set edit(val: boolean | undefined) { this.editable = !!val }

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
            console.log("do action", action.type, action.value, action.keep);
            // 有undo功能的action或者返回了undo栈，入栈
            if (service.undo || Array.isArray(result)) {
                // 是否有keep栈，不覆盖undo
                const last = this.actionStack.length ? this.actionStack[this.actionStack.length - 1] : null;
                if (last && last.keep === true && last.type === action.type) {
                    last.value = action.value;
                    last.keep = action.keep;
                } else {
                    this.actionStack.push({ ...action, undo: result || [] });
                }
                if (clearUndo) {
                    this.undoStack = [];
                }
            }
        }
    }
    // 外部使用的执行操作
    exec(type: string, value?: any, keep?: boolean) {
        this.doAction({ type, value, keep });
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
                if (func) {
                    func(lastAction.value, this);
                } else {
                    setAndSaveValues(this.config, lastAction.undo || []);
                }
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

    get selected() {
        return (this.config.selected || []).length > 0;
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

    // 只有在展示时使用，需要用合并后的单元格，对于右下角，需要转换
    get selectedShowRanges() {
        return (this.config.selected || []).map(range => {
            return getRangeHandleMerged(this.config.merged || [], range, true);
        });
    }

    /**
     * 获取当前范围数组内的单元格列表[最小格]
     * @param ranges 范围数组
     * @returns 单元格列表
     */
    getCellListInRanges(ranges: ICellRange[]): ICellKey[] {
        const minCellRanges = ranges.map(range => getRangeHandleMerged(this.config.merged || [], range, false));
        return getRangeCells(minCellRanges, this.headerDeep);
    }
    // 1. 范围优先级：selecRange > body/header > all
    // 2. 值优先级：cells/rows/cols > body/header > all
    // 3. 展示：如果当前范围的目标对象值均相等，则取当前范围，否则往上优先级找
    // 4. 设值：对当前范围的目标列表设值，同时清除下级范围的值设置
    /**
     * 范围取值（展示）
     * @param key 字段
     * @param type 类型
     * @param useGlobal 是否强制使用全局量 
     */
    getRangeValue(type: IValueType, key: IConfigKey | IConfigKey[], userRange: ICellRange[] | ICellRange | ICellKey | IRowKey | IColKey | false = false) {
        const keys = Array.isArray(key) ? key : [key];
        const selected = userRange ? getTargetRange(userRange) : this.config.selected || [];
        let range = this.globalRange;
        if (selected.length > 0) {
            // 有选择范围，获取单元格列表
            const list = this.getCellListInRanges(selected);
            if (list.length) {
                const getCellValue = (cell: ICellKey) => {
                    return getPriorityValue(this.config, [
                        [type, getCellTypeKey(cell, type), ...keys],
                        [cell.type, type, ...keys],
                        ["all", type, ...keys]
                    ]);
                }
                // 是否所有单元格值相同
                const firstValue = getCellValue(list[0]);
                const nosameValue = list.findIndex(cell => getCellValue(cell) != firstValue) >= 0;
                if (nosameValue) {
                    // 如果类型相同，那么优先当前类型的值
                    const nosameType = list.findIndex(cell => cell.type !== list[0].type) >= 0;
                    range = nosameType ? "all" : list[0].type;
                } else {
                    // 值全部相同
                    return firstValue;
                }
            }
        }
        if (range === "all") {
            return getValue(this.config, [range, type, ...keys]);
        } else {
            return getPriorityValue(this.config, [
                [range, type, ...keys],
                ["all", type, ...keys]
            ]);
        }
    }
    /**
     * 范围设值（保存）
     * @param key 字段
     * @param type 类型
     * @param useGlobal 是否强制使用全局量 
     */
    setRangeValue(type: IValueType, key: IConfigKey | IConfigKey[], value: any, userRange: ISaveRange = false, clearKeys: Array<IConfigKey | IConfigKey[]> = []): ISaveValues {
        const keys = Array.isArray(key) ? key : [key];
        const selected = userRange ? getTargetRange(userRange) : this.config.selected || [];
        const saves: ISaveValues = [];
        if (selected.length > 0) {
            const list = this.getCellListInRanges(selected);
            list.map(cell => {
                saves.push({ value, paths: [type, getCellTypeKey(cell, type), ...keys] });
            });
        } else {
            const globalRange = type === "col" ? "all" : this.globalRange;
            saves.push({ value, paths: [globalRange, type, ...keys] });
            // 清除下层
            if (globalRange === "all") {
                saves.push({ value: undefined, paths: ["header", type, ...keys] });
                saves.push({ value: undefined, paths: ["body", type, ...keys] });
            }
            // 遍历当前type的key值，清除范围内的
            const target = this.config[type] || {};
            Object.keys(target).map(typekey => {
                // col不区分body/header，col只有global
                if (this.globalRange === "all" || type === "col" || typekey.includes(this.globalRange)) {
                    saves.push({ value, paths: [type, typekey, ...keys] });
                    clearKeys.map(key => {
                        const paths = Array.isArray(key) ? key : [key];
                        saves.push({ value, paths: [type, typekey, ...paths] });
                    })
                }
            });
        }
        const saveTarget = setAndSaveValues(this.config, saves);
        return saveTarget;
    }

    setMultiRangeValue(configs: IRangeSetAry) {
        let undoTargets: ISaveValues = [];
        configs.map(({ type, key, value, range = false, clearKeys= [] }) => {
            const cur = this.setRangeValue(type, key, value, range, clearKeys);
            undoTargets = undoTargets.concat(cur);
        });
        return undoTargets;
    }


    /************************事件相关 ********************************/
    /**是否目标table */
    isEventTarget(e: any) {
        const wrapper = e.target?.closest(`div.${this.prefix("inner-table")}`);
        return wrapper === this.tableRef;
    }
}