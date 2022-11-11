import EvDriver from "../driver/EvDriver";

/** 操作执行对象 */
export interface IActionItem {
    /** 类型 */
    type: string;
    /** 值 */
    value?: any;
    /** 是否保持并覆盖上一个，但是起始内容不变 */
    keep?: boolean;
}

/** 批量设值配置 */
export type ISaveValues = Array<{ value: any; paths: string[] }>;

/** 栈内容 */
export interface IStackMember extends IActionItem{
    /** 回退设值数组 */
    undo?: ISaveValues;
}
/** 操作栈 */
export type IActionStack = IStackMember[];

/** 操作处理对象 */
export interface IActionService {
    /** 执行动作，return false时不入栈 */
    exec: (driver: EvDriver, value: any) => ISaveValues | false | void;
    /** 回退动作，默认执行set undo values */
    undo?: (driver: EvDriver, value: any) => void;
}
/** 操作处理对象map */
export type IActionServiceMap = Record<string, IActionService>;

