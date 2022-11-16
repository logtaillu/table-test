/**
 * 各种分类定义和key结构
 */
/**
 * 单元格类型  
 * body - 内容  
 * header - 表头  
 * external - 左侧多余 -先不定义
 */
export type ICellType = "body" | "header";
/**
 * 全局范围类型  
 * body - 内容  
 * header - 表头  
 * all - 全部
 */
export type IGlobalRange = "body" | "header" | "all";

/**
 * 设值类型  
 * col - 列  
 * row - 行  
 * cell - 单元格  
 * wrap - 其他外层参数
 */
export type IValueType = "col" | "row" | "cell" | "wrap";

/**
 * 一个范围的边框类型  
 * all - 全部  
 * none - 无边框  
 * left - 左边框  
 * right - 右边框  
 * top - 上边框  
 * bottom - 下边框  
 * outter - 外围边框  
 * inner - 内部边框  
 * horizontal - 横向  
 * vertical - 纵向  
 */
export type IBorderType = "all" | "none" | "left" | "top" | "right" | "bottom" | "outter" | "inner" | "horinzontal" | "vertical";

/**
 * 范围间关系  
 * in - 被包含  
 * out - 分离  
 * same - 完全相同  
 * part - 部分重叠，交错  
 * contain 包含
 */
 export type IRangeRelation = "in" | "out" | "same" | "part" | "contain";

/** 单元格序号对象 */
export interface ICellKey {
    /** 类型内行号 */
    row: number;
    /** 列号, 复合表头按最内层计算 */
    col: number;
    /** 单元格类型 */
    type: ICellType;
}

/** 行序号对象 */
export type IRowKey = Pick<ICellKey, "row" | "type">;

/** 列序号对象 */
export type IColKey = Pick<ICellKey, "col">;

/** 范围定义 */
export interface ICellRange {
    /** 起始单元格 */
    from: ICellKey;
    /** 结束单元格 */
    to: ICellKey;
}

/** 可用范围传参 */
export type IRangeType = ICellRange | ICellKey | IRowKey | IColKey | false | IGlobalRange;
export type IRangeAryType = IRangeType | ICellRange[];