/**
 * table操作配置缓存及操作栈管理
 * 每个table有自己的driver
 */
import { makeObservable, observable, action, computed } from "mobx"
import { IActionStack, ITableCacheConfig, IAcitonServiceMap, IActionItem, ICellRange } from "./ITableDriver"
import DriverFunc from "./DriverFunc";
import { ITableService } from "../services/ITableService";
import eventUtil from "../utils/eventUtil";
export type IGlobalRange = "body" | "header" | "all";
export interface ISettableProps {
    config?: ITableCacheConfig
    prefixCls?: string;
    lang?: string;
    editable?: boolean;
    globalRange?: IGlobalRange;
}
export default class TableDriver extends DriverFunc {
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
    constructor(props: ISettableProps) {
        super();
        makeObservable(this, {
            config: observable,
            selecting: observable,
            doAction: action,
            exec: action,
            redoAction: action,
            undoAction: action,
            reset: action,
            selectedRanges: computed,
            mergedRanges: computed,
            selectedShowRanges: computed,
            tableRef: observable.ref,
            prefixCls: observable,
            undoEnable: computed,
            redoEnable: computed,
            lang: observable,
            editable: observable,
            setConf: observable,
            globalRange: observable
        });
        // 直接使用props传入对象，作为整体处理
        this.setConf(props);
    }

    setConf(props: ISettableProps) {
        if (props.config) {
            this.config = props.config;
        }
        if (props.lang) {
            this.lang = props.lang;
        }
        if (props.prefixCls) {
            this.prefixCls = props.prefixCls;
        }
        if ('editable' in props) {
            this.editable = !!props.editable;
        }
        if (props.globalRange) {
            this.globalRange = props.globalRange;
        }
    }


    // 简易的样式前缀补充函数
    prefix = (cls: string = "") => {
        return cls.length ? cls.split(" ").filter(s => !!s).map(s => this.prefixCls + "-" + s).join(" ") : this.prefixCls;
    }

    // 重置
    reset(config: ITableCacheConfig) {
        this.actionStack = [];
        this.undoStack = [];
        this.config = config;
    }

    // 注册动作
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
    // 移除
    remove() {
        eventUtil.removeEvents(this);
    }

    // 执行操作
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


    get undoEnable() {
        return this.actionStack.length > 0;
    }

    get redoEnable() {
        return this.undoStack.length > 0;
    }
    /************************范围(range)操作 ********************************/

    get selectedRanges(): ICellRange[] {
        return (this.config.selected || []).map(range => this.getFormatedRange(range));
    }

    get mergedRanges(): ICellRange[] {
        return (this.config.merged || []).map(range => this.getFormatedRange(range));
    }
    // 只有在展示时，需要用合并后的单元格，对于右下角，需要转换
    get selectedShowRanges() {
        const merged = this.config.merged || [];
        return (this.config.selected || []).map(range => {
            // 格式化
            let { from, to } = this.getFormatedRange(range);
            // 考虑非最小格的情况，找到包含右下角的
            const target = merged.find(current => {
                return this.getCellRelationToRange(to, current) !== "out";
            });
            if (target) {
                to = this.getFormatedRange(target).to;
            }
            return { from, to };
        });
    }

    /************************事件相关 ********************************/
    /**是否目标table */
    isEventTarget(e: any) {
        const wrapper = e.target?.closest(`div.${this.prefix("inner-table")}`);
        return wrapper === this.tableRef;
    }
}