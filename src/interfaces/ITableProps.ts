import EvDriver from "../driver/EvDriver";
import { IDriverContent } from "./IDriverContent";
import { IEvPlugin } from "./IPlugin";
/** 表格入参 */
export interface ITableProps<T = any> {
    /** 外部提供的driver */
    driver?: EvDriver;
    /** 外部提供的content */
    content?: IDriverContent;
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
}
/** ref定义 */
export interface ITableRef {
    driver: EvDriver;
}
/** hook函数定义 */
export type IDriverHook = (value: any, driver: EvDriver) => void;
/** hook类型 */
export type IDriverHookType = "onContentInit";