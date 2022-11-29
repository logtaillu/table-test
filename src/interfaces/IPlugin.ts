import EvDriver from "../driver/EvDriver";
import { IActionServiceMap } from "./IActionStack";
import { ITableProps } from "./ITableProps";
/** 事件名称 */
export type IEventName = keyof WindowEventMap;
/** 事件对象 */
export interface IPluginEvent {
    /** 事件名称 */
    name: IEventName;
    /** 事件处理函数 */
    func: (driver: EvDriver, e: any) => void;
    /** keydown事件时，键值 */
    key?: string;
    /**  keydown事件时，是否按下ctrl */
    ctrl?: boolean;
}

/** 功能插件 */
export interface IEvPlugin {
    /** 修改Props */
    enrich?: (props: ITableProps) => ITableProps;
    /** 操作处理对象map */
    actions?: IActionServiceMap;
    /** 事件列表 */
    events?: IPluginEvent[];
}