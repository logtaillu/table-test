/** 表格控制器 */
import { makeAutoObservable, observable } from "mobx";
import { IActionService, IActionStack, ISaveValues } from "../interfaces/IActionStack";
import { IClearConf, IConfigKey, IDriverCache, IMultiRangeSetter } from "../interfaces/IDriverCache";
import { IGlobalRange, IRangeAryType, IExtendValueType, ICellKey, ICellRange } from "../interfaces/IGlobalType";
import { IEvPlugin, IPluginEvent } from "../interfaces/IPlugin";
import { IColumnList, IRenderCol, ITableDriverProps, ITableProps } from "../interfaces/ITableProps";
import { mergeConfig } from "../utils/baseUtil";
import eventUtil from "../utils/eventUtil";
import { doAction, redo, undo } from "./actions";
import initContent from "./initContent";
import { getRangeValue, setRangeValue } from "./ranges";
import { getFormattedMergeRange, getMergedTarget } from "../utils/rangeUtil";
import base from "../plugins/base";
import { isEmpty } from "../utils/valueUtil";
import selectRange from "../plugins/selectRange";
import { getLength, isMerged } from "./calcute";
import initData from "./initData";
const defaultPlugins = [base, selectRange];
export default class EvDriver {

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
    /** 是否右选择范围 */
    get haveSelectRange() {
        return (this.content?.selected?.length || 0) > 0;
    }
    get formatedSelected() {
        return (this.content?.selected || []).map(s => getFormattedMergeRange(s, this.content.merged || []));
    }

    /*******************配置内容 **********************/
    /** 配置内容 */
    cache: IDriverCache = {};
    set content(value: IDriverCache | undefined) {
        this.actionStack = [];
        this.undoStack = [];
        this.cache = mergeConfig(initContent(), value || {});
    }
    get content(): IDriverCache {
        return this.cache;
    }
    init(content?: IDriverCache, columns?: IColumnList, data?: any[]) {
        initData(this, content, columns, data);
    }
    /** 获取merged范围 */
    get merged() {
        return this.content?.merged || [];
    }
    /** 获取单元格合并值，类型一定时body */
    getMergedValue(cell: ICellKey) {
        const target = getMergedTarget(this.merged, cell);
        if (target) {
            const { from, to } = target;
            if (from.col === cell.col && from.type === cell.type && from.row === cell.row) {
                return { colSpan: to.col - from.col + 1, rowSpan: to.row - from.row + 1 };
            } else {
                return { colSpan: 0, rowSpan: 0 };
            }

        } else {
            return { colSpan: 1, rowSpan: 1 };
        }
    }
    /** 范围取值 */
    getValue(type: IExtendValueType, path: IConfigKey[] | IConfigKey, range: IRangeAryType = false, grange?: IGlobalRange, content?: IDriverCache) {
        return getRangeValue(this, type, path, range, grange || this.globalRange, content || this.content || {});
    }
    /** 范围设值 */
    setValue(type: IExtendValueType, path: IConfigKey[] | IConfigKey, value: any, range: IRangeAryType = false, clears: IClearConf = [], grange?: IGlobalRange, content?: IDriverCache) {
        // set value用cache
        return setRangeValue(this, type, path, value, range, clears, grange || this.globalRange, content || this.cache || {});
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
    private selectingIn: ICellKey | false = false;
    get selecting() {
        return this.selectingIn;
    }
    set selecting(value: ICellKey | false) {
        this.selectingIn = value;
    }

    editable: boolean = false;
    globalRange: IGlobalRange = "all";
    onRow: ITableDriverProps["onRow"] = undefined;
    onHeaderRow: ITableDriverProps["onHeaderRow"] = undefined;
    rowkey: ITableDriverProps["rowkey"] = undefined;
    data: any[] = [];
    dropType: ITableDriverProps["dropType"] = "";
    onDrop: ITableDriverProps["onDrop"] = undefined;

    update(props: ITableDriverProps) {
        Object.keys(props).map(key => {
            if (this[key] !== props[key] && !isEmpty(props[key])) {
                this[key] = props[key];
            }
        });
    }

    /** 底层columns列表 */
    private renderColAry: IRenderCol[] = [];
    set renderCols(value: IRenderCol[]) {
        this.renderColAry = value;
    }
    get renderCols() {
        return this.renderColAry;
    }
    /** 层叠的columns列表 */
    private evcolumns: IRenderCol[][] = [];
    set columns(value: IRenderCol[][]) {
        this.evcolumns = value;
    }
    get columns() {
        return this.evcolumns;
    }
    // 行列真实大小缓存
    sizes: Record<string, number> = {};
    setSize(key, value) {
        this.sizes[key] = value;
    }

    getLength(from: ICellKey | null, to: ICellKey | null, type: "row" | "col", include: boolean) {
        return getLength(this, from, to, type, include);
    }

    get isMerged() {
        return isMerged(this);
    }
}