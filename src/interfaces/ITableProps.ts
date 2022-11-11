import React from "react";
import { IDriverSetter } from "./IDriverCache";
import { IEvPlugin } from "./IPlugin";
import { IToolbarItem } from "./IToolbar";
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
}

