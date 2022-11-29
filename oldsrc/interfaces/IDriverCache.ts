/**
 * 控制器内结构定义
 */

import { ICellConfig, ICellCssVars, IColConfig, IGlobalBorderConfig, IRowConfig } from "../../src/interfaces/IConfig";
import { ICellRange, IColKey, IExtendValueType, IGlobalRange, IRangeAryType, IRowKey } from "./IGlobalType";

/** 可用配置字段 */
export type IConfigKey = keyof ICellConfig | keyof IRowConfig | keyof IColConfig | keyof ICellCssVars | keyof IGlobalBorderConfig | keyof IDriverCache;


/** 设值时，目标对象里同时清除值的定义 */
export type IClearConf = IConfigKey[][];

/** 范围设值对象 */
export interface IRangeSetter {
    /** 类型 */
    type: IExtendValueType;
    /** 目标字段路径 */
    path: IConfigKey[] | IConfigKey;
    /** 值 */
    value: any;
    /** 指定范围 */
    range?: IRangeAryType;
    /** 指定的全局范围 */
    grange?: IGlobalRange;
    /** 指定的content */
    content?: IDriverCache;
    /** 额外需要清除的字段 type - */
    clears?: IClearConf;
}
/** 批量范围设值 */
export type IMultiRangeSetter = Array<IRangeSetter>;
/** bodyrow缓存 */
export interface IBodyRow {
    /** 行key */
    key: string;
    record: any;
}
