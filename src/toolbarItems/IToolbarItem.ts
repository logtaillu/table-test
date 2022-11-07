import React from "react";
import { IntlShape } from "react-intl";
import TableDriver from "../tableDriver/TableDriver";
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
    /**@description select list模式才有的value传参 */
    value?: any;
    setValue: (value: any) => void;
}
export type IToolbarFunc<T> = (args: IToolbarArgs) => T;
export interface IToolbarItemObj {
    /**@description 标识 */
    key: string;
    /**@description 资源列表 */
    source?: any;
    /**@description 提示语 */
    tooltip: string | IToolbarFunc<string>;
    /**@description 图标，特殊值value代表取getValue的值 */
    icon: React.ReactElement | IToolbarFunc<React.ReactElement> | true;
    /**@description 禁用状态 */
    disabled?: IToolbarFunc<boolean>;
    /**@description 高亮状态 */
    active?: IToolbarFunc<boolean>;
    /**@description 点击事件，btn模式点击按钮触发，list模式选择触发，dropdown模式close触发 */
    onClick?: IToolbarFunc<void>;
    /**@description 自定义dropdown模式 */
    dropdown?: IToolbarFunc<React.ReactElement>;
    /**@description dropdown/list模式，获取当前值函数 */
    getValue?: IToolbarFunc<any>;
}

export type IToolbarItem = IToolbarItemObj | string;