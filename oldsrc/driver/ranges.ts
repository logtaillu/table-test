// 范围设值操作
// 值层级(每个type)
// wrap : global
// row : all => body/header => row
// cell : all => body/header => body/header(col) => (cell)
import EvDriver from "./EvDriver";
import { ICellKey, IRangeAryType, IGlobalRange, IRangeType, IColKey, IBaseValueType, IExtendValueType, ICellType } from "../interfaces/IGlobalType";
import { IClearConf, IConfigKey, IDriverCache, IRecord } from "../interfaces/IDriverCache";
import { getRangeCellList, getTargetRangeList } from "../utils/rangeUtil";
import { getCellKeyObj, getCellTypeKey } from "../utils/keyUtil";
import { getPriorityValueAry, setAndSaveValues } from "../utils/valueUtil";
import { ISaveValues } from "../interfaces/IActionStack";
interface IStageType {
    /** 是否全局类型 */
    global: boolean;
    /** 获取层级路径 */
    getpath: (path: IConfigKey[], valType: IBaseValueType, cell: ICellKey) => string[];
    /** 获取对上清除用的cell列表 */
    getcells: (content: IDriverCache, vt: IBaseValueType) => ICellKey[];
    /** 对所有下级清除cell过滤函数 */
    filter: (cell: ICellKey, list: ICellKey[]) => boolean;
}
const stageTypes: IRecord<IStageType> = {
    // 外层
    wrap: {
        // 是否全局
        global: true,
        getpath: path => path,
        getcells: () => ([]),
        filter: () => true
    },
    all: {
        global: true,
        getpath: (path, vt) => (["all", vt, ...path]),
        getcells: () => ([]),
        filter: () => true // 全部
    },
    type: {
        global: true,
        getpath: (path, vt, cell) => ([cell.type, vt, ...path]),
        getcells: () => {
            return (["header", "body"] as ICellType[]).map(type => ({ type, row: 0, col: 0 }));
        },
        filter: (cell, list) => list.findIndex(c => c.type === cell.type) >= 0 // 类型一致，list唯一cell.type是grange
    },
    inner: {
        global: false,
        getpath: (path, vt, cell) => ([vt, getCellTypeKey(cell, vt), ...path]),
        getcells: (content, vt) => {
            return Object.keys(content[vt] || {}).map(k => getCellKeyObj(k));
        },
        filter: () => false // 没有下级
    },
    coltype: {
        global: false,
        getpath: (path, vt, cell) => (["col", getCellTypeKey(cell, "col"), cell.type, ...path]),
        getcells: (content, vt) => {
            return Object.keys(content.col || {}).map(k => getCellKeyObj(k));
        },
        filter: (cell, list) => {
            return list.findIndex(c => c.type === cell.type && c.col === cell.col) >= 0;
        }
    }
}
interface IValType {
    /** 阶段列表 */
    stages: Array<keyof typeof stageTypes>;
    /** 查找当前阶段 */
    current: (list: ICellKey[], grange: IGlobalRange, type: IExtendValueType) => keyof typeof stageTypes;
}
const valTypes: IRecord<IValType> = {
    wrap: {
        stages: ["wrap"],
        current: () => "wrap"
    },
    col: {
        stages: ["all", "inner"],
        current: list => list.length ? "inner" : "all"
    },
    row: {
        stages: ["all", "type", "inner"],
        current: (list, grange) => list.length ? "inner" : grange === "all" ? "all" : "type"
    },
    cell: {
        stages: ["all", "type", "coltype", "inner"],
        current: (list, grange, type) => {
            if (list.length) {
                return type === "colcell" ? "coltype" : "inner";
            } else {
                return grange === "all" ? "all" : "type";
            }
        }
    }
}

/** 扩展类型转化基础类型 */
function getBaseValType(type: IExtendValueType): IBaseValueType {
    return type === "colcell" ? "cell" : type;
}

/** 获取当前的cell list、全局范围、base value type、current stage等基础量  */
function baseValueHandle(driver: EvDriver, type: IExtendValueType, range: IRangeAryType, gr: IGlobalRange, content: IDriverCache) {
    const vt = getBaseValType(type);
    let list: ICellKey[] = [];
    let grange = gr;
    if (typeof (range) === "string") { // 不转化全局类型
        grange = range;
    } else {
        const ranges = range ? getTargetRangeList(driver, range) : content?.selected || [];
        list = getRangeCellList(ranges, driver.merged, content?.deep || 0);
    }
    // 当前阶段
    const current = valTypes[vt].current(list, grange, type);
    // 更新list
    list = stageTypes[current].global ? [{ row: 0, col: 0, type: grange === "all" ? "body" : grange }] : list;
    const stages = valTypes[vt].stages;
    const stageIdx = stages.indexOf(current);
    return {
        list, // 格子列表
        vt, // base value type
        stageIdx, // 当前阶段序号
    }
}

/** 取值 */
export function getRangeValue(driver: EvDriver, type: IExtendValueType, p: IConfigKey[] | IConfigKey, range: IRangeAryType = false, userGrange: IGlobalRange, content: IDriverCache) {
    const path = Array.isArray(p) ? p : [p];
    const { list, vt, stageIdx } = baseValueHandle(driver, type, range, userGrange, content);
    if (list.length) {
        // 1. 遍历单元格
        const stages = valTypes[vt].stages;
        const listvalues: any[] = [];
        list.map(cell => {
            const pathlist: string[][] = [];
            // 从当前stage往前生成取值路径
            for (let i = stageIdx; i >= 0; i--) {
                const curStage = stages[i];
                pathlist.push(stageTypes[curStage].getpath(path, vt, cell));
            }
            // 取一组值
            listvalues.push(getPriorityValueAry(content, pathlist));
        });
        // 2. 取值，找到第一个所有cell相同的层级，最后一层是global类型，总是全部相同
        const firstValue = listvalues[0];
        const targetValue = firstValue.find((v, idx) => {
            const nosame = listvalues.findIndex(vary => vary[idx] !== v);
            return nosame < 0;
        });
        return targetValue;
    }
    return undefined;
}

/** 设值 */
export function setRangeValue(driver: EvDriver, type: IExtendValueType, p: IConfigKey[] | IConfigKey, value: any, range: IRangeAryType = false, clears: IClearConf = [], userGrange: IGlobalRange, content: IDriverCache) {
    const path = Array.isArray(p) ? p : [p];
    const { list, vt, stageIdx } = baseValueHandle(driver, type, range, userGrange, content);
    const result: ISaveValues = [];
    const pushValues = (ary: ICellKey[], val: any, stage: IStageType) => {
        ary.map(cell => {
            result.push({ value: val, path: stage.getpath(path, vt, cell) });
            clears.map(plist => {
                result.push({ value: undefined, path: stage.getpath(plist, vt, cell) });
            });
        })
    }
    const stages = valTypes[vt].stages;
    // 1. 遍历当前层级设值
    pushValues(list, value, stageTypes[stages[stageIdx]]);
    // 2. 向下遍历层级
    const filter = stageTypes[stages[stageIdx]].filter;
    for (let i = stageIdx + 1; i < stages.length; i++) {
        const curStage = stageTypes[stages[i]];
        const cells = curStage.getcells(content, vt).filter(cell => filter(cell, list));
        pushValues(cells, undefined, curStage);
    }
    const saveTarget = setAndSaveValues(content, result);
    return saveTarget;
}