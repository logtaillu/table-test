/**
 * 控制器内结构定义
 */

import { ICellConfig, ICellCssVars, IColConfig, IGlobalBorderConfig, IRowConfig } from "./IConfig";
import { IBaseValueType, ICellRange, IExtendValueType, IGlobalRange, IRangeAryType } from "./IGlobalType";

/** record类型，key是行/列/单元格的key */
export type IRecord<T> = Record<string, T>;

/** 全局类型的配置 */
export interface IGlobalCache {
    /** 行配置 */
    row?: IRowConfig;
    /** 列配置 */
    col?: IColConfig;
    /** 单元格配置 */
    cell?: ICellConfig & IGlobalBorderConfig;
}

/** 配置存储结构 */
export interface IDriverCache {
    /** 单元格配置 */
    cell?: IRecord<ICellConfig>;
    /** 行配置，不做范围内cell配置，因为和col的优先级是同级的 */
    row?: IRecord<IRowConfig>;
    /** 列配置，与范围内cell配置, col是横跨body/header的 */
    col?: IRecord<IColConfig & { body?: ICellConfig, header?: ICellConfig }>;
    /** 表头配置 */
    header?: Pick<IGlobalCache, "row" | "cell">;
    /** 表内容配置 */
    body?: Pick<IGlobalCache, "row" | "cell">;
    /** 整体配置 */
    all?: IGlobalCache;
    /** 合并的单元格，可not foramtted，只针对单类型，body/header不能合并在一起 */
    merged?: ICellRange[];
    /** 选择范围，可not formatted, not mintarget */
    selected?: ICellRange[];
    // 计数相关字段
    /** 数据行数，会用data更新  */
    rowCount?: number;
    /** 数据列数，以最内层计算，会用columns更新 */
    colCount?: number;
    /** 附加列数，内部计算 */
    externalCount?: number;
    /** 表头深度 */
    deep?: number;
}

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
