import { makeObservable, observable, action } from "mobx"
import { IActionStack, ITableCacheConfig, IAcitonServiceMap, IActionItem } from "./ITableDriver"
export default class TableDriver {
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
    constructor(config: ITableCacheConfig) {
        makeObservable(this, {
            config: observable,
            selecting: observable,
            doAction: action,
            redoAction: action,
            undoAction: action
        });
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
}