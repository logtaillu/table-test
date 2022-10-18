/**
 * table操作配置缓存及操作栈管理
 * 每个table有自己的driver
 */
import { makeObservable, observable, action, computed } from "mobx"
import { IActionStack, ITableCacheConfig, IAcitonServiceMap, IActionItem, ICellRange } from "./ITableDriver"
import DriverFunc from "./DriverFunc";
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
    // 表格元素
    tableRef: HTMLDivElement | null = null;
    constructor(config: ITableCacheConfig, prefixCls?: string) {
        super();
        makeObservable(this, {
            config: observable,
            selecting: observable,
            doAction: action,
            redoAction: action,
            undoAction: action,
            reset: action,
            selectedRanges: computed,
            mergedRanges: computed,
            selectedShowRanges: computed,
            prefix: computed,
            tableRef: observable.ref
        });
        // 直接使用props传入对象，作为整体处理
        this.config = config;
        if (prefixCls) {
            this.prefixCls = prefixCls;
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
    registerActions(actions: IAcitonServiceMap) {
        Object.keys(actions).map(key => {
            this.actionMap[key] = actions[key];
        });
    }

    // 执行操作
    doAction(action: IActionItem, clearUndo: boolean = true) {
        const service = this.actionMap[action.type];
        if (service) {
            const result = service.exec(action, this);
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
            let { from, to } = this.getFormatedRange(range);
            // 找到包含右下角的
            const target = merged.find(current => {
                return this.getCellRelationToRange(to, current) !== "out";
            });
            if (target) {
                to = this.getFormatedRange(target).to;
            }
            return { from, to };
        });
    }


}