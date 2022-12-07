/** driver content定义 */

import { ICellConfig, ICellCssVars, IColConfig, IGlobalBorderConfig, IRowConfig } from "./IConfig";

/** record类型，key是行/列/单元格的key */
export type IRecord<T> = Record<string, T>;
/**
 * 单元格类型  
 * body - 内容  
 * header - 表头  
 */
export type ICellType = "body" | "header";
/**
 * 全局范围类型  
 * body - 内容  
 * header - 表头  
 * all - 全部
 */
export type IGlobalRange = "body" | "header" | "all";

/** 基础设值类型 */
export type IBaseValueType = "col" | "row" | "cell" | "wrap";

/**
 * 设值类型  
 * col - 列  
 * row - 行  
 * cell - 单元格  
 * wrap - 外层参数
 * colcell - col层级的cell
 */
export type IExtendValueType = IBaseValueType | "colcell";
/** 单项取值 */
export type IContentValueType = IExtendValueType | "single";
/**
 * 范围间关系  
 * in - 被包含  
 * out - 分离  
 * same - 完全相同  
 * part - 部分重叠，交错  
 * contain 包含
 */
export type IRangeRelation = "in" | "out" | "same" | "part" | "contain";

/** 单元格序号对象 */
export interface ICellKey {
    /** 类型内行号 */
    row: string;
    /** 列号 */
    col: string;
    /** 单元格类型 */
    type: ICellType;
}

/** 行序号对象 */
export type IRowKey = Pick<ICellKey, "row" | "type">;

/** 列序号对象 */
export type IColKey = Pick<ICellKey, "col">;

/** 范围定义 */
export interface ICellRange {
    /** 起始单元格 */
    from: ICellKey;
    /** 结束单元格 */
    to: ICellKey;
}

/** 可用范围传参 */
export type IRangeType = ICellRange | ICellKey | IRowKey | IColKey | false | IGlobalRange;
/** 可用范围数组 */
export type IRangeAryType = IRangeType | Array<ICellKey | IRowKey | IColKey | ICellRange>;

export interface IGlobalCache {
    /** 行配置 */
    row?: IRowConfig;
    /** 列配置 */
    col?: IColConfig;
    /** 单元格配置 */
    cell?: ICellConfig & IGlobalBorderConfig;
}

export interface IDriverContent {
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
    merged: ICellRange[];
    /** 选择范围，可not formatted, not mintarget */
    selected: ICellRange[];
    /** 列key列表 */
    columns: string[];
    /** body行key列表 */
    rows: string[];
    /** header行key列表 */
    headers: string[];
}

/** 可用配置字段 */
export type IConfigKey = keyof ICellConfig | keyof IRowConfig | keyof IColConfig | keyof ICellCssVars | keyof IGlobalBorderConfig | keyof IDriverContent;
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
    content?: IDriverContent;
    /** 额外需要清除的字段 type - */
    clears?: IClearConf;
}
/** 批量范围设值 */
export type IMultiRangeSetter = Array<IRangeSetter>;