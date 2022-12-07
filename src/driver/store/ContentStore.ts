/** content控制 */
import { makeAutoObservable, toJS } from "mobx";
import ClassifyAry from "../structs/ClassifyAry";
import { IClearConf, IConfigKey, IContentValueType, IDriverContent, IExtendValueType, IGlobalRange, IMultiRangeSetter, IRangeAryType } from "../../interfaces/IDriverContent";
import { ITableProps } from "../../interfaces/ITableProps";
import EvDriver from "../EvDriver";
import mergeContent, { getInitContent } from "../utils/mergeContent";
import RangeUtil from "../utils/rangeUtil";

export default class ContentStore {
    driver: EvDriver;
    util: RangeUtil;
    constructor(driver: EvDriver) {
        this.driver = driver;
        this.util = new RangeUtil(this);
        makeAutoObservable(this, { driver: false, util: false });
    }
    /** 配置内容 */
    content: IDriverContent = getInitContent();
    /** 不存储的配置内容 */
    cache: IDriverContent = getInitContent();
    /** 行 */
    rows: ClassifyAry<string> = new ClassifyAry();
    /** 列 */
    columns: ClassifyAry<string> = new ClassifyAry();
    /** 当前全局范围 */
    grange: IGlobalRange = "all";
    set globalRange(value: ITableProps["globalRange"]) {
        if (value) {
            this.grange = value;
        }
    }
    /** 顺序取值对象 */
    get contents() {
        return [this.content, this.cache];
    }
    /** 刷新content */
    set contentInfo(content: ITableProps["content"]) {
        this.content = mergeContent(content);
        this.rows.set([
            ["header", this.content.headers],
            ["body", this.content.rows]
        ]);
        this.rows.set([
            ["columns", this.content.columns]
        ]);
        this.driver.action.execHook("onContentInit", toJS(this.content));
    }
    /**范围取值 */
    getValue(type: IContentValueType, path: IConfigKey[] | IConfigKey, range: IRangeAryType = false, grange?: IGlobalRange) {
        
    }
    /** 范围设值 */
    setValue(type: IExtendValueType, path: IConfigKey[] | IConfigKey, value: any, range: IRangeAryType = false, clears: IClearConf = [], grange?: IGlobalRange) {
        
    }
    /** 批量范围设值 */
    setValues(configs: IMultiRangeSetter) {
        
    }

}