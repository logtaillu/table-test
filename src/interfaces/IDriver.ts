/**
 * 控制器内结构定义
 */

import { ICellConfig, IColConfig, IRowConfig } from "./IConfig";
import { IBorderType } from "./IGlobalType";

/** record类型，key是行/列/单元格的key */
export type IRecord<T> = Record<string, T>;

/** 全局才有的整体边框配置 */
export interface IGlobalBorderConfig {
    borderType?: IBorderType;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
}

/** 全局类型的配置 */
export interface IGlobalCache {
    /** 行配置 */
    row?: IRowConfig;
    /** 列配置 */
    col?: IColConfig;
    /** 单元格配置 */
    cell?: ICellConfig & IGlobalBorderConfig;
}

/** 配置存储结构 */
export interface IDriverCache {
    /** 单元格配置 */
    cell?: IRecord<ICellConfig>;
    /** 行配置 */
    row?: IRecord<IRowConfig>;
    /** 列配置 */
    col?: IRecord<IColConfig>;
    header?: Pick<IGlobalCache, "row" | "cell">;
    body?: Pick<IGlobalCache, "row" | "cell">;
    all?: IGlobalBorderConfig;
}