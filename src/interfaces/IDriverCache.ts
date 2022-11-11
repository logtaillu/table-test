/**
 * 控制器内结构定义
 */

import { ICellConfig, ICellCssVars, IColConfig, IGlobalBorderConfig, IRowConfig } from "./IConfig";
import { ICellRange, IGlobalRange, IRangeType, IValueType } from "./IGlobalType";

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
    /** 行配置 */
    row?: IRecord<IRowConfig>;
    /** 列配置 */
    col?: IRecord<IColConfig>;
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

/** driver可初始化对象 */
export interface IDriverSetter {
    /** 配置对象 */
    content?: IDriverCache;
    /** 编辑状态 */
    editable?: boolean;
    /** className前缀 */
    prefixCls?: string;
    /** 最大操作栈项数 */
    maxStack?: string;
    /** 当前语言 */
    lang?: string;
    /** 当前全局类型 */
    global?: IGlobalRange;
}

/** 可用配置字段 */
export type IConfigKey = keyof ICellConfig | keyof IRowConfig | keyof IColConfig | keyof ICellCssVars | keyof IGlobalBorderConfig | keyof IDriverCache;

/** 范围设值对象 */
export interface IRangeSetter {
    /** 类型 */
    type: IValueType;
    /** 目标字段路径 */
    path: IConfigKey[];
    /** 值 */
    value: any;
    /** 指定范围 */
    range?: IRangeType;
    /** 额外需要清除的字段*/
    clears?: Array<IConfigKey[]>;
}
/** 批量范围设值 */
export type IMultiRangeSetter = Array<IRangeSetter>;