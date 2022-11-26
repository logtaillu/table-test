import EvDriver from "../driver/EvDriver";
import { ICellKey, ICellRange } from "../interfaces/IGlobalType";
import { IEvPlugin } from "../interfaces/IPlugin";
import { getCellKeyObj } from "../utils/keyUtil";
import { getCellRelationToRange, getMergedRange, getRangeRelation } from "../utils/rangeUtil";
interface ISelectResult {
    cellKey: ICellKey;
    clear: boolean;
}
const getTargetCell = (driver: EvDriver, e: any): ISelectResult | null => {
    const cls = e.target?.classList || [];
    // 排除resize的；情况
    if (cls.contains("react-resizable-handle")) {
        return null;
    }
    const cellele = e.target?.closest(`[data-cell]`);
    if (cellele) {
        const cellkeystr = cellele.dataset.cell;
        return {
            cellKey: getCellKeyObj(cellkeystr),
            clear: !e.ctrlKey
        };
    }
    return null;
}
export default {
    actions: {
        selectStart: {
            exec(driver, value: ISelectResult) {
                const { cellKey, clear } = value;
                driver.selecting = cellKey;
                if (clear) {
                    driver.cache.selected = [];
                }
                driver.cache.selected = driver.cache.selected || [];
                // 塞入一个单元格的范围
                driver.cache.selected.push({ from: cellKey, to: cellKey });
            }
        },
        selectChange: {
            exec(driver, value: ISelectResult) {
                if (!driver.selecting) {
                    return false;
                }
                const { cellKey } = value;
                const ranges = driver.cache.selected = driver.cache.selected || [];
                if (ranges.length) {
                    // 当前range一定是最后一个range
                    const cur = ranges[ranges.length - 1];
                    const newrange = { from: cur.from, to: cellKey };
                    if (getRangeRelation(newrange, cur, driver.merged) === "same") {
                        return false;
                    } else {
                        const { from, to } = getMergedRange({ from: driver.selecting, to: cellKey }, driver.merged);
                        cur.from = from;
                        cur.to = to;
                    }

                } else {
                    return false;
                }
            }
        },
        selectEnd: {
            exec(driver) {
                driver.selecting = false;
            }
        },
        // 合并/拆分单元格
        mergeCell: {
            exec(driver, value) {
                const selected = driver.content.selected || [];
                driver.cache.merged = driver.cache.merged || [];
                const merged = driver.cache.merged;
                if (driver.isMerged) {
                    // 拆分：如果merged里有范围相同的，则移除
                    const removed: ICellRange[] = [];
                    selected.map(range => {
                        const idx = merged.findIndex(mr => getRangeRelation(mr, range, merged) === "same");
                        if (idx >= 0) {
                            const [item] = merged.splice(idx, 1);
                            removed.push(item);
                        }
                    });
                    return { removed, added: [] };
                } else {
                    // 合并
                    // selected range中排除单个单元格/已合并/重叠/被包含/被其他选择范围包含
                    const removed: ICellRange[] = [];
                    const added: ICellRange[] = [];
                    selected.map((range, idx, ary) => {
                        const isSingle = getCellRelationToRange(range.from, range, merged) === "same";
                        const isMerged = merged.findIndex(mr => getRangeRelation(range, mr, merged) === "same") >= 0;
                        const isCrossIn = ary.findIndex((r, sidx) => {
                            const rela = getRangeRelation(range, r, merged);
                            return rela === "in" || rela === "part" || (rela === "same" && idx < sidx);
                        }) >= 0;
                        if (!isSingle && !isMerged && !isCrossIn) {
                            // same已排除，in/part不应该出现
                            const containIdx = merged.findIndex(mr => getRangeRelation(range, mr, merged) === "contain");
                            if (containIdx >= 0) {
                                const [item] = merged.splice(containIdx, 1);
                                removed.push(item);
                            }
                            added.push(range);
                            merged.push(range);
                        }
                    });
                    return { removed, added };
                }
            },
            undo(driver, value) {
                const undo: any = value.undo || {};
                const { removed = [], added = [] } = undo;
                removed.map(r => {
                    driver.merged.push(r);
                })
                added.map(r => {
                    const idx = driver.merged.indexOf(r);
                    if (idx >= 0) {
                        driver.merged.splice(idx, 1);
                    }
                })
            },
        }
    },
    events: [
        {
            // 开始选择
            name: "mousedown",
            func(driver, e) {
                const value = getTargetCell(driver, e);
                if (value) {
                    driver.exec("selectStart", value);
                }
            }
        },
        {
            name: "mousemove",
            func(driver, e) {
                const value = getTargetCell(driver, e);
                if (value && driver.selecting) {
                    driver.exec("selectChange", value);
                }
            }
        },
        {
            // 选择结束
            name: "mouseup",
            func(driver, e) {
                if (driver.selecting) {
                    driver.exec("selectEnd");
                }
            }
        }
    ]
} as IEvPlugin;