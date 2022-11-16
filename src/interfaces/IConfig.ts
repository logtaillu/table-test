/**
 * 单行列单元格数据配置
 */

import { IBorderType } from "./IGlobalType";

/**单行配置 */
export interface IRowConfig {
    /** 行高 */
    rowHeight?: number;
    /** 是否自动高度 @default true */
    autoHeight?: boolean;
}

/**单列配置 */
export interface IColConfig {
    /** 列宽, % or px */
    colWidth?: number | string;
}

/** 单元格样式变量 */
export interface ICellCssVars {
    /** 字号 */
    "--ev-fsz"?: number;
    /** 字体 */
    "--ev-ff"?: string;
    /** 文字颜色 */
    "--ev-fc"?: string;
    /** 横向对齐 */
    "--ev-ah"?: string;
    /** 纵向对齐 */
    "--ev-av"?: string;
    /** 背景色 */
    "--ev-bg"?: string;
    /** 加粗，基于font-weight */
    "--ev-fw"?: string;
    /** 斜体，基于font-style */
    "--ev-fsy"?: string;
    /** 下划线，基于font-decoration */
    "--ev-dr"?: string;
    /** 上边框宽度 */
    "--ev-bwt"?: string;
    /** 上边框样式 */
    "--ev-bst"?: string;
    /** 上边框颜色 */
    "--ev-bct"?: string;
    /** 右边框宽度 */
    "--ev-bwr"?: string;
    /** 右边框样式 */
    "--ev-bsr"?: string;
    /** 右边框颜色 */
    "--ev-bcr"?: string;
    /** 下边框宽度 */
    "--ev-bwb"?: string;
    /** 下边框样式 */
    "--ev-bsb"?: string;
    /** 下边框颜色 */
    "--ev-bcb"?: string;
    /** 左边框宽度 */
    "--ev-bwl"?: string;
    /** 左边框样式 */
    "--ev-bsl"?: string;
    /** 左边框颜色 */
    "--ev-bcl"?: string;
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


/** 全局才有的整体边框配置 */
export interface IGlobalBorderConfig {
    /** 边框类型 */
    borderType?: IBorderType;
    /** 边框宽度 */
    borderWidth?: string;
    /** 边框颜色 */
    borderColor?: string;
    /** 边框样式 */
    borderStyle?: string;
}