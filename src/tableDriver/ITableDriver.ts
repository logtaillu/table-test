import TableDriver from "./TableDriver";

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
/**@description 单元格配置 */
export interface ICellConfig {

}
/**@description 可用字段 */
export type IConfigKey = keyof ICellConfig | keyof IRowConfig | keyof IColConfig;

export type ICacheObj<T> = Record<string, T>;

/**@description 单个n合一配置 */
export interface IGlobalCacheConfig {
    row?: IRowConfig;
    cell?: ICellConfig;
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
    header?: IGlobalCacheConfig;
    /**@description 内容全局配置 */
    body?: IGlobalCacheConfig;
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

/**操作栈相关 */
export interface IActionItem {
    /**@description 类型 */
    type: string;
    /**@description 内容*/
    value?: any;
}
export type IActionStack = IActionItem[];

// 操作执行动作
export interface IActionService {
    /**@description 执行,返回false时不入stack */
    exec: (driver: TableDriver, value: any) => void | false;
    /**@description 撤销 */
    undo?: (driver: TableDriver, value: any) => void;
}
export type IAcitonServiceMap = ICacheObj<IActionService>;
