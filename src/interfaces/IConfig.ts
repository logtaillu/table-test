/**
 * 单行列单元格数据配置
 */

/**单行配置 */
export interface IRowConfig {
    /** 行高 */
    rowHeight?: number;
    /** 是否自动高度 @default true */
    autoHeight?: boolean;
}

/**单列配置 */
export interface IColConfig {
    /** 列宽 */
    colWidth?: number;
}

/** 单元格样式变量 */
export interface ICellCssVars {

}

/**单元格配置 */
export interface ICellConfig {
    /** 样式变量，会传给style */
    cssvar?: ICellCssVars;
    /** 有无左边框 */
    bl?: boolean;
    /** 有无右边框 */
    br?: boolean;
    /** 有无上边框 */
    bt?: boolean;
    /** 有无下边框 */
    bb?: boolean;
}