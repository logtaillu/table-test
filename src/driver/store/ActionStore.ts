import { makeAutoObservable } from "mobx";
import SetMap from "../../components/SetMap";
import { IActionService, IActionStack } from "../../interfaces/IActionStack";
import { IEvPlugin, IPluginEvent } from "../../interfaces/IPlugin";
import { IDriverHook, IDriverHookType } from "../../interfaces/ITableProps";
import EvDriver from "../EvDriver";
import eventUtil from "../utils/eventUtil";
const defaultPlugins: IEvPlugin[] = [];
export default class ActionStore {
    driver: EvDriver;
    constructor(driver: EvDriver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
    /** 事件 */
    events: SetMap<IPluginEvent> = new SetMap();
    /** 表格元素 */
    tableRef: HTMLDivElement | null = null;
    /** 操作处理对象map */
    acServiceMap: Map<string, IActionService> = new Map();
    /** 注册插件 */
    register(plugins: IEvPlugin[]) {
        plugins = defaultPlugins.concat(plugins);
        plugins.map(p => {
            const { events = [], actions = {} } = p;
            Object.keys(actions).map(key => this.acServiceMap.set(key, actions[key]));
            events.map(event => {
                this.events.push(event.name, event);
            });
        });
        eventUtil.add(this.driver);
    }
    /** 插件全部移除 */
    remove() {
        eventUtil.remove(this.driver);
        this.events.clear();
        this.acServiceMap.clear();
    }
    /** 是否事件目标 */
    isEventTarget(e) {
        const wrapper = e.target?.closest(`div.${this.driver.props.prefix("scroll-table")}`);
        return wrapper === this.tableRef;
    }
    /**********action stack相关 ***********/
    /** 操作栈 */
    actionStack: IActionStack = [];
    /** 回退栈 */
    undoStack: IActionStack = [];
    /**最大操作栈记录数，-1代表不限制 */
    maxStackValue: number = 10;
    /** 刷新maxStack */
    set maxStack(value: number | undefined) {
        if (typeof (value) === "number") {
            this.maxStackValue = value;
            // 更新栈数量
            if (value >= 0 && this.actionStack.length > value) {
                this.actionStack.splice(0, this.actionStack.length - value);
            }
            if (value >= 0 && this.undoStack.length > value) {
                this.undoStack.splice(0, this.actionStack.length - value);
            }
        }
    }
    /** 是否可以undo */
    get undoEnable() {
        return this.actionStack.length > 0;
    }
    /** 是否可以redo */
    get redoEnable() {
        return this.undoStack.length;
    }

    /****** hooks 相关 ********/
    /**************hooks相关 *******************/
    // hooks
    hooks: SetMap<any> = new SetMap();
    // 添加hook
    on(name: IDriverHookType, func: IDriverHook) {
        this.hooks.push(name, func);
        return this;
    }
    // 移除hook
    off(name: IDriverHookType, func: IDriverHook) {
        this.hooks.delete(name, func);
        return this;
    }
    // 执行一类hooks
    execHook(name: IDriverHookType, value) {
        this.hooks.map(name, (func) => {
            func(value, this.driver);
        });
    }

}