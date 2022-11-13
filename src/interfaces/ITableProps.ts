import React from "react";
import { IDriverSetter } from "./IDriverCache";
import { IEvPlugin } from "./IPlugin";
import { IToolbarItem } from "./IToolbar";
// 类型渲染：值符合，renderType,else render || defaultRender
/** 列配置 */
export interface IColumn {
    /** 键 */
    key?: string;
    /** 宽度，数值(px)或百分比，eg: "50%" */
    width?: number | string;
    /** 路径，用.分隔，优先判断带.情况的列是否存在 */
    dataIndex: string | string[];
    /** 内容 */
    title: React.ReactNode;
    /** 样式名 */
    className?: string;
    /** 内联样式 */
    style?: React.CSSProperties;
    /** 冻结列，true or 'left' or 'right' */
    fixed?: boolean | string;
    /** colspan */
    colSpan?: number;
    /** 对齐 */
    align?: string;
    /** 渲染header单元格 */
    renderHeader?: () => React.ReactNode;
    /** 渲染body单元格 */
    renderCell?: () => React.ReactNode;
    /** 获取header单元格props */
    onHeader?: () => React.ReactNode;
    /** 获取body单元格props */
    onCell?: () => React.ReactNode;
    /** 特定类型渲染时，如果title不是string|number，需要获取header单元格的值 */
    getHeaderValue?: () => any;
    /** 特定类型渲染时，如果title不是string|number，需要获取body单元格的值 */
    getCellValue?: () => any;
    /** header类型 */
    headerType?: string;
    /** body类型 */
    cellType?: string;
}
/** 复合表头 */
export interface IColumnGroup extends IColumn {
    children: IColumn[];
}
/** 表头组 */
export type IColumnList = Array<IColumnGroup | IColumn>;
/** 表格入参 */
export interface ITableProps extends IDriverSetter {
    /** 样式名 */
    className?: string;
    /** 内联样式 */
    style?: React.CSSProperties;
    /** 自定义语言文本 */
    locales?: Record<string, any>;
    /** 插件列表 */
    plugins?: IEvPlugin[];
    /** 工具栏资源map */
    sources?: Record<string, any>;
    /** 工具栏配置 */
    items?: IToolbarItem[][];
    /** 是否展示工具栏 */
    toolbar?: boolean;
    /** 列配置 [unused]*/
    columns?: IColumnList;
    /** 是否展示表头 [unused] */
    showHeader?: boolean;
    /** table tableLayout [unused] */
    tableLayout?: "fixed" | "auto";
}
