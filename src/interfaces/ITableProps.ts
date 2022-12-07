import EvDriver from "../driver/EvDriver";
import { IDriverContent, IGlobalRange } from "./IDriverContent";
import { IEvPlugin } from "./IPlugin";
import { IToolbarItem } from "./IToolbar";
/** 可编辑类型 */
export interface IEditable {
    /** 列resize */
    colResizeable?: boolean;
    /** 行resize */
    rowResizeable?: boolean;
    /** 单元格编辑 */
    cellEditable?: boolean;
    /** 是否有工具栏 */
    toolbar?: boolean;
}
/** 表格入参 */
export interface ITableProps<T = any> {
    /** 外部提供的driver */
    driver?: EvDriver;
    /** 外部提供的content */
    content?: Partial<IDriverContent>;
    /** 是否输出日志 */
    debug?: boolean | string[];
    /** 最大历史记录数 */
    maxStack?: number;
    /** 插件列表 */
    plugins?: IEvPlugin[];
    /** 当前语言 */
    lang?: string;
    /** 自定义语言文本 */
    locales?: Record<string, any>;
    /** 样式前缀 */
    prefixCls?: string;
    /** 样式名 */
    className?: string;
    /** 内联样式 */
    style?: React.CSSProperties;
    /** 是否可编辑 */
    editable?: boolean | IEditable;
    /** 工具栏资源map */
    sources?: Record<string, any>;
    /** 工具栏配置 */
    items?: IToolbarItem[][];
    /** 当前globalRange */
    globalRange?: IGlobalRange;

    /** 初始化用，非存储量 */
    // data?: T[];
    // columns?: any[];
    // rowCount?: number;
    // colCount?: number;
    // headerCount?: number;
}
/** ref定义 */
export interface ITableRef {
    driver: EvDriver;
}
/** hook函数定义 */
export type IDriverHook = (value: any, driver: EvDriver) => void;
/** hook类型 */
export type IDriverHookType = "onContentInit";