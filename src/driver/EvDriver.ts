/** 表格控制器 */
import { makeAutoObservable, observable } from "mobx";
import { IActionItem, IActionServiceMap, IActionStack, ISaveValues } from "../interfaces/IActionStack";
import { IClearConf, IConfigKey, IDriverCache, IDriverSetter, IMultiRangeSetter } from "../interfaces/IDriverCache";
import { IGlobalRange, IRangeAryType, IExtendValueType } from "../interfaces/IGlobalType";
import { IEvPlugin, IPluginEvent } from "../interfaces/IPlugin";
import { IRenderCol } from "../interfaces/ITableProps";
import { mergeConfig } from "../utils/baseUtil";
import eventUtil from "../utils/eventUtil";
import { doAction, redo, undo } from "./actions";
import initContent from "./initContent";
import { getRangeValue, setRangeValue } from "./ranges";

export default class EvDriver {
    constructor() {
        makeAutoObservable(this, {
            tableRef: observable.ref
        });
    }
    update(props: IDriverSetter) {
        Object.keys(props).map(key => this[key] = props[key]);
    }
    /*******************事件与操作处理注册 **********************/
    /** 事件按类型列表 */
    events: Record<string, IPluginEvent[]> = {};
    /** 表格元素 */
    tableRef: HTMLDivElement | null = null;
    /** 注册插件 */
    register(plugins: IEvPlugin[]) {
        plugins.map(p => {
            const { events = [], actions = {} } = p;
            this.acServiceMap = { ...this.acServiceMap, ...actions };
            events.map(event => {
                this.events[event.name] = this.events[event.name] || [];
                this.events[event.name].push(event);
            });
        });
        eventUtil.add(this);
    }
    /** 插件全部移除 */
    remove() {
        eventUtil.remove(this);
        this.events = {};
        this.acServiceMap = {};
    }
    /** 是否事件目标 */
    isEventTarget(e) {
        const wrapper = e.target?.closest(`div.${this.prefix("table-core")}`);
        return wrapper === this.tableRef;
    }
    /*******************动作处理 **********************/
    /** 操作栈 */
    actionStack: IActionStack = [];
    /** 回退栈 */
    undoStack: IActionStack = [];
    /** 操作处理对象map */
    acServiceMap: IActionServiceMap = {};
    /**最大操作栈记录数，-1代表不限制 */
    maxStackIn: number = -1;
    get maxStack(): number {
        return this.maxStackIn;
    }
    set maxStack(value: number | undefined) {
        this.maxStackIn = typeof (value) === "number" ? value : this.maxStackIn;
        if (this.maxStackIn >= 0 && this.actionStack.length > this.maxStackIn) {
            this.actionStack.splice(0, this.actionStack.length - this.maxStackIn);
        }
    }

    /**对外的执行动作函数 */
    exec(type: string, value?: any, keep?: boolean) {
        doAction(this, { type, value, keep });
    }
    /** 重做 */
    redo() {
        redo(this);
    }
    /** 回退 */
    undo() {
        undo(this);
    }
    /** 是否可以undo */
    get undoEnable() {
        return this.actionStack.length > 0;
    }
    /** 是否可以redo */
    get redoEnable() {
        return this.undoStack.length;
    }
    /** 是否右选择范围 */
    get haveSelectRange() {
        return (this.content?.selected?.length || 0) > 0;
    }

    /*******************配置内容 **********************/
    /** 配置内容 */
    cache: IDriverCache = {};
    set content(value: IDriverCache | undefined) {
        this.actionStack = [];
        this.undoStack = [];
        this.cache = mergeConfig(initContent(), value || {});
    }
    get content() {
        return this.cache;
    }
    /** 获取merged范围 */
    get merged() {
        return this.content?.merged || [];
    }
    /** 范围取值 */
    getValue(type: IExtendValueType, path: IConfigKey[], range: IRangeAryType = false, grange?: IGlobalRange, content?: IDriverCache) {
        return getRangeValue(this, type, path, range, grange || this.globalRange, content || this.content || {});
    }
    /** 范围设值 */
    setValue(type: IExtendValueType, path: IConfigKey[], value: any, range: IRangeAryType = false, clears: IClearConf = [], grange?: IGlobalRange, content?: IDriverCache) {
        return setRangeValue(this, type, path, value, range, clears, grange || this.globalRange, content || this.content || {});
    }
    /**批量范围设值 */
    setValues(configs: IMultiRangeSetter) {
        let undoTargets: ISaveValues = [];
        configs.map(({ type, path, value, range = false, clears = [], grange, content }) => {
            const cur = this.setValue(type, path, value, range, clears, grange, content);
            undoTargets = undoTargets.concat(cur);
        });
        return undoTargets;
    }

    /*******************其他临时状态 **********************/
    /** 是否正在选择中 */
    selectingIn: boolean = false;
    get selecting() {
        return this.selectingIn;
    }
    set selecting(value: boolean) {
        this.selectingIn = value;
    }
    /** className前缀 */
    prefixClsIn: string = "ev";
    get prefixCls(): string {
        return this.prefixClsIn;
    }
    set prefixCls(value: string | undefined) {
        this.prefixClsIn = value || this.prefixClsIn;
    }
    /**获取带前缀样式
     * @param cls {string} 样式名
     */
    prefix(cls: string = "") {
        return cls.length ? cls.split(" ").filter(s => !!s).map(s => this.prefixCls + "-" + s).join(" ") : this.prefixCls;
    }

    /** 编辑状态 */
    editableIn: boolean = false;
    get editable(): boolean {
        return this.editableIn;
    }
    set editable(value: boolean | undefined) {
        this.editableIn = value || this.editableIn;
    }
    /** 当前语言 */
    langIn: string = navigator.language;
    get lang(): string {
        return this.langIn;
    }
    set lang(value: string | undefined) {
        this.langIn = value || this.langIn;
    }
    /** 当前全局范围 */
    globalRangeIn: IGlobalRange = "all";
    get globalRange(): IGlobalRange {
        return this.globalRangeIn;
    }
    set globalRange(value: IGlobalRange | undefined) {
        this.globalRangeIn = value || this.globalRangeIn;
    }

    /** 底层columns列表 */
    renderColAry: IRenderCol[] = [];
    set renderCols(value: IRenderCol[]) {
        this.renderColAry = value;
    }
    get renderCols() {
        return this.renderColAry;
    }
    /** 层叠的columns列表 */
    evcolumns: IRenderCol[][] = [];
    set columns(value: IRenderCol[][]) {
        this.evcolumns = value;
    }
    get columns() {
        return this.evcolumns;
    }
}