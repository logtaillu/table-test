/** content控制 */
import { makeAutoObservable, toJS } from "mobx";
import SerialMap from "../../components/SerialMap";
import { IClearConf, IConfigKey, IContentValueType, IDriverContent, IExtendValueType, IGlobalRange, IMultiRangeSetter, IRangeAryType } from "../../interfaces/IDriverContent";
import { ITableProps } from "../../interfaces/ITableProps";
import EvDriver from "../EvDriver";
import mergeContent from "../utils/mergeContent";

export default class ContentStore {
    driver: EvDriver;
    constructor(driver: EvDriver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
    /** 配置内容 */
    content: IDriverContent = {};
    /** 不存储的配置内容 */
    cache: IDriverContent = {};
    /** body行 */
    rows: SerialMap<string> = new SerialMap();
    /** 列 */
    columns: SerialMap<string> = new SerialMap();
    /** header行 */
    headers: SerialMap<string> = new SerialMap();
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
        this.rows.reset(this.content.rows);
        this.columns.reset(this.content.columns);
        this.headers.reset(this.content.headers);
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