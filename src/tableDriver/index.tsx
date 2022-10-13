import { makeObservable, observable, action } from "mobx"
import { IActionStack, ITableCacheConfig } from "./ITableDriver"
export default class TableDriver {
    // 操作栈
    private actions: IActionStack[] = [];
    // 操作栈当前的位置，包含
    private currentAction: number = -1;
    // 是否正在选择范围
    selecting: boolean = false;
    // 是否已注册到监听器
    registered: boolean = false;
    // 配置集合
    config: ITableCacheConfig = {};
    constructor() {
        makeObservable(this, {
            config: observable,
            selecting: observable,
            doAction: action,
            redoAction: action,
            undoAction: action
        });
    }

    // 执行操作
    doAction() {
        
    }
    // 重做
    redoAction() {
        
    }
    // 回退
    undoAction() {
        
    }
}