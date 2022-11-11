import TableDriver from "./TableDriver";
import { defaultCssVars } from "./getDefaultConfig";
export type ICellType = "body" | "header";
export type IGlobalRange = "body" | "header" | "all";
export type IValueType = "col" | "row" | "cell";
export interface IRowKey {
    /**@description 序号，从0计数，单个类型 */
    index: number;
    /**@description 类型 */
    type: ICellType;
}
/**@description 列序号生成需求 */
export interface IColKey {
    /**@description 序号，从0计数 */
    index: number;
}

export interface ICellKey {
    /**@description 列号 */
    col: number;
    /**@description 行号[单个类型] */
    row: number;
    /**@description 类型 */
    type: ICellType;
}


/**@description 列配置 */
export interface IColConfig {
    /**@description 列宽 */
    colWidth?: number;
}
/**@description 行配置 */
export interface IRowConfig {
    /**@description 行高 */
    rowHeight?: number;
    /**@description 是否自动高度 */
    autoHeight?: boolean;
}
/**@description cell样式变量 */
export type ICellCssVars = typeof defaultCssVars;
/**@description 单元格配置 */
export interface ICellConfig {
    /**@description 样式变量 */
    cssvars?: Partial<ICellCssVars>;
    /**@description 四向边框有无 */
    bl?: boolean;
    br?: boolean;
    bt?: boolean;
    bb?: boolean;
}


/**@description 边框类型 */
/**
 * all 全部有
 * none 全部没有
 * left/top/right/bottom 添加单项
 * outliner/inner 添加外框/内部
 * horizontal/vertical 水平/纵向
 */
export type IBorderType = "all" | "none" | "left" | "top" | "right" | "bottom" | "outter" | "inner" | "horinzontal" | "vertical";
/**@description 全局配置里持有的特殊配置 */
export interface IGlobalBorderConfig {
    bordeType?: IBorderType;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
}

/**@description 可用字段 */
export type IConfigKey = keyof ICellConfig | keyof IRowConfig | keyof IColConfig | keyof ICellCssVars | keyof IGlobalBorderConfig;

export type ICacheObj<T> = Record<string, T>;
/**@description 单个n合一配置 */
export interface IGlobalCacheConfig {
    row?: IRowConfig;
    cell?: ICellConfig & IGlobalBorderConfig;
    col?: IColConfig;
}

export interface ICellRange {
    from: ICellKey;
    to: ICellKey;
}
/**
 * @description 范围间关系
 * in 被包含
 * out 分离
 * same 完全相同
 * part 部分重叠，交错
 * contain 包含
 */
export type IRangeRelation = "in" | "out" | "same" | "part" | "contain";

/**@description 整体存储结构 */
// cells/rows/cols > header/body
export interface ITableCacheConfig {
    /**@description 单元格单独配置 */
    cell?: ICacheObj<ICellConfig>;
    /**@description 行单独配置 */
    row?: ICacheObj<IRowConfig>;
    /**@description 列单独配置 */
    col?: ICacheObj<IColConfig>;
    /**@description 表头全局配置 */
    header?: Pick<IGlobalCacheConfig,"cell"|"row">;
    /**@description 内容全局配置 */
    body?: Pick<IGlobalCacheConfig,"cell"|"row">;
    /**@description 整体全局配置 */
    all?: IGlobalCacheConfig;
    /**@description 合并的单元格范围，可以not formatted */
    merged?: ICellRange[];
    /**@description 选择的单元格范围，可以not formatted，可以非最小单元格[merge/noMerge都有可能] */
    selected?: ICellRange[];
    /**@description 指定的最小行数 */
    rowCount?: number;
    /**@description 指定的最小列数 */
    colCount?: number;
}

// 批量设值
export type ISaveValues = Array<{ value: any; paths: string[] }>;

/**操作栈相关 */
/**@description 用户操作对象 */
export interface IActionItem {
    /**@description 类型 */
    type: string;
    /**@description 内容*/
    value?: any;
    /**@description 保持并覆盖上一个，但是起始内容不变*/
    keep?: boolean;
}
/**@description stack操作对象 */
export interface IActionStackItem extends IActionItem {
    undo?: ISaveValues;
}
export type IActionStack = IActionStackItem[];

// 操作执行动作

export interface IActionService {
    /**@description 执行,返回false时不入stack */
    exec: (driver: TableDriver, value: any) => ISaveValues | false | void;
    /**@description 撤销 */
    undo?: (driver: TableDriver, value: any) => void;
}
export type IAcitonServiceMap = ICacheObj<IActionService>;

/**@description setRange的userRange可用值 */
export type ISaveRange = ICellRange[] | ICellRange | ICellKey | IRowKey | IColKey | false;
/**@description 一组setRange配置 */
export type IRangeSetAry = Array<{ type: IValueType, key: IConfigKey | IConfigKey[], value: any, range?: ISaveRange, clearKeys?: Array<IConfigKey | IConfigKey[]> }>;