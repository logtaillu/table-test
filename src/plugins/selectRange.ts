import EvDriver from "../driver/EvDriver";
import { ICellKey } from "../interfaces/IGlobalType";
import { IEvPlugin } from "../interfaces/IPlugin";
import { getCellKeyObj } from "../utils/keyUtil";
import { getRangeRelation } from "../utils/rangeUtil";
interface ISelectResult {
    cellKey: ICellKey;
    clear: boolean;
}
const getTargetCell = (driver: EvDriver, e: any): ISelectResult| null => {
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
                driver.selecting = true;
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
                    if (getRangeRelation(newrange, cur, driver.content.merged||[]) === "same") {
                        return false;
                    } else {
                        cur.to = cellKey;
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