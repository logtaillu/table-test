



/** 值类型 */
export type ICellDataType = "img" | "text" | "date" | "select" | "color" | "number" |"checkbox"|"switch" | string;
/** 拖拽单元格 */
export interface IDragItem {
    /** 值内容 */
    value: any;
    /** 值类型 */
    format?: string;
    /** 类型 */
    type?: string;
    /** 其他自定义内容 */
    info?: any;
}