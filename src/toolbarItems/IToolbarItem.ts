import React from "react";
import { IntlShape } from "react-intl";
import TableDriver from "../tableDriver";
/**
 * 工具栏项目
 * 有点击和popover2种模式，应该也可以扩展其他模式，比如弹窗
 * 可以自定义资源列表
 * 可以设置disabled和active状态
 * 能做source覆盖
 */
export interface IToolbarArgs {
    driver: TableDriver;
    intl: IntlShape;
    source: any;
}
export type IToolbarFunc<T> = (args: IToolbarArgs) => T;
export interface IToolbarItemObj {
    /**@description 标识 */
    key: string;
    /**@description 资源列表 */
    source?: any;
    /**@description 提示语 */
    tooltip: IToolbarFunc<string>;
    /**@description 图标 */
    icon: IToolbarFunc<React.ReactElement>;
    /**@description 禁用状态 */
    disabled?: IToolbarFunc<boolean>;
    /**@description 高亮状态 */
    active?: IToolbarFunc<boolean>;
    /**@description 点击事件 */
    onClick?: IToolbarFunc<void>;
    /**@description 下拉模式，此时不需要onClick */
    dropdown?: IToolbarFunc<React.ReactElement>;
}

export type IToolbarItem = IToolbarItemObj | string;