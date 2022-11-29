import React from "react";
import EvDriver from "../driver/EvDriver";
import { IDriverCache } from "./IDriverCache";
import { ICellKey, IDragItem, IGlobalRange, IRowKey } from "./IGlobalType";
import { IEvPlugin } from "./IPlugin";
import { IToolbarItem } from "./IToolbar";
// 类型渲染：值符合，renderType,else render || defaultRender
/** 列配置 */
export interface IColumn {
    /** 键 */
    key?: string;
    /** 宽度，数值(px)或百分比，eg: "50%", 60*/
    width?: number | string;
    /** 路径，用.分隔，优先判断带.情况的列是否存在*/
    dataIndex: string | string[];
    /** 内容*/
    title: React.ReactNode;
    /** 样式名 */
    className?: string;
    /** cell样式名 */
    cellClassName?: string;
    /** 内联样式 */
    style?: React.CSSProperties;
    /** cell内联样式 */
    cellStyle?: React.CSSProperties;
    /** 冻结列，true or 'left' or 'right' [unused]*/
    fixed?: boolean | string;
    /** colspan，不会自动判断下一个是否为0*/
    colSpan?: number;
    /** 对齐*/
    align?: string;
    /** 渲染body单元格*/
    renderCell?: (text: any, record: any, row: number) => React.ReactNode;
    /** 获取header单元格props*/
    onHeader?: (data: IRenderCol) => React.ReactNode;
    /** 获取body单元格props*/
    onCell?: (record: any, row: number) => React.ReactNode;
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
/** driver传递的Props */
export interface ITableDriverProps<T = any> {
    /** 编辑状态 */
    editable?: boolean | {
        /** 列resize */
        colResizeable?: boolean;
        /** 行resize */
        rowResizeable?: boolean;
        /** 单元格编辑 */
        cellEditable?: boolean;
    };
    /** className前缀 */
    prefixCls?: string;
    /** 最大操作栈项数 */
    maxStack?: number;
    /** 当前语言 */
    lang?: string;
    /** 当前全局类型 */
    globalRange?: IGlobalRange;
    /** 行key[body部分] */
    rowkey?: (data: T, row: number) => string;
    /** 内容行属性 */
    onRow?: (column: IRenderCol, rowkey: IRowKey) => any;
    /** 表头行属性 */
    onHeaderRow?: (column: IRenderCol, rowkey: IRowKey) => any;
    /** 拖拽接收类型 */
    dropType?: string;
    /** 自行处理接收操作 */
    onDrop?: (driver: EvDriver, cell:ICellKey, value: IDragItem) => void;
}

/** 表格入参 */
export interface ITableProps<T = any> extends ITableDriverProps<T> {

    /** 是否展示表头 */
    showHeader?: boolean;
    /** table tableLayout */
    tableLayout?: "fixed" | "auto";
    /** 列配置 */
    columns?: IColumnList;
    /** 配置对象 */
    content?: IDriverCache;
    /** 数据内容 */
    data?: T[];
    /** 是否可滚动 */
    scroll?: boolean;
    /** 是否最小100% */
    expand?: boolean;
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
    
}

export interface ITableCoreProps extends ITableProps {
    plugins?: IEvPlugin[];
    /** 是否输出日志 */
    debug?: boolean | string[];
};
