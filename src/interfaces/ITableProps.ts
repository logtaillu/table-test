import React from "react";
import { IDriverSetter } from "./IDriverCache";
import { IEvPlugin } from "./IPlugin";
import { IToolbarItem } from "./IToolbar";
// 类型渲染：值符合，renderType,else render || defaultRender
/** 列配置 */
export interface IColumn {
    /** 键 [unused]*/
    key?: string;
    /** 宽度，数值(px)或百分比，eg: "50%" [unused]*/
    width?: number | string;
    /** 路径，用.分隔，优先判断带.情况的列是否存在 [unused]*/
    dataIndex: string | string[];
    /** 内容 [unused]*/
    title: React.ReactNode;
    /** 样式名 [unused]*/
    className?: string;
    /** 内联样式 [unused]*/
    style?: React.CSSProperties;
    /** 冻结列，true or 'left' or 'right' [unused]*/
    fixed?: boolean | string;
    /** colspan，不会自动判断下一个是否为0 [unused]*/
    colSpan?: number;
    /** 对齐 [unused]*/
    align?: string;
    /** 渲染header单元格 [unused]*/
    renderHeader?: () => React.ReactNode;
    /** 渲染body单元格 [unused]*/
    renderCell?: () => React.ReactNode;
    /** 获取header单元格props [unused]*/
    onHeader?: () => React.ReactNode;
    /** 获取body单元格props [unused]*/
    onCell?: () => React.ReactNode;
    /** 特定类型渲染时，如果title不是string|number，需要获取header单元格的值 *[unused] */
    getHeaderValue?: () => any;
    /** 特定类型渲染时，如果title不是string|number，需要获取body单元格的值 [unused]*/
    getCellValue?: () => any;
    /** header类型 [unused]*/
    headerType?: string;
    /** body类型 [unused]*/
    cellType?: string;
}
/** 复合表头 */
export interface IColumnGroup extends IColumn {
    children: IColumn[];
}

export interface IRenderCol extends IColumn {
    /** 是否叶子节点 */
    isLeaf: boolean;
    /** 纵向合并 */
    rowSpan: number;
    /** 横向合并 */
    colSpan: number;
    /** 类型内行数 */
    row: number;
    /** 类型内列数 */
    col: number;
}

/** 表头组 */
export type IColumnList = Array<IColumnGroup | IColumn>;
/** table部分用的Props */
export interface IPluginList {
     /** 插件列表 */
     plugins?: IEvPlugin[];
}

/** 表格入参 */
export interface ITableProps<T = any> extends IDriverSetter {
    /** 样式名 */
    className?: string;
    /** 内联样式 */
    style?: React.CSSProperties;
    /** 自定义语言文本 */
    locales?: Record<string, any>;
    /** 工具栏资源map */
    sources?: Record<string, any>;
    /** 工具栏配置 */
    items?: IToolbarItem[][];
    /** 是否展示工具栏 */
    toolbar?: boolean;
    /** 列配置 */
    columns?: IColumnList;
    /** 是否展示表头 */
    showHeader?: boolean;
    /** table tableLayout */
    tableLayout?: "fixed" | "auto";
    /** 数据内容 */
    data?: T[];
}

export type ITableCoreProps = IPluginList & ITableProps;
