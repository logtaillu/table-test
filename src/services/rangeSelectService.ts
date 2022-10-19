import TableDriver from "../tableDriver";
import { ICellKey } from "../tableDriver/ITableDriver";
import { ITableService } from "./ITableService";
export interface ISelectRangeAction {
    cellKey: ICellKey;
    clear?: boolean;
}
const getTargetCell = (driver: TableDriver, e: any) => {
    const cls = e.target?.classList || [];
    // 排除resize的；情况
    if (cls.contains("react-resizable-handle")) {
        return null;
    }
    const cellele = e.target?.closest(`td.${driver.prefix("cell")}, th.${driver.prefix("cell")}`);
    if (cellele) {
        const trele = cellele.parentElement;
        const cellKey: ICellKey = {
            col: Number(cellele.dataset.colnum),
            row: Number(trele.dataset.rownum),
            type: cellele.tagName.toUpperCase() === "TD" ? "body" : "header"
        };
        return {
            cellKey,
            clear: !e.ctrlKey
        } as ISelectRangeAction;
    }
    return null;
}
export default {
    enrichProps(tableProps, driver) {
        return {};
    },
    actions: {
        selectStart: {
            exec(driver, value: ISelectRangeAction) {
                const { cellKey, clear } = value;
                driver.selecting = true;
                if (clear) {
                    driver.config.selected = [];
                }
                driver.config.selected = driver.config.selected || [];
                // 塞入一个单元格的范围
                driver.config.selected.push({ from: cellKey, to: cellKey });
            }
        },
        selectChange: {
            exec(driver, value: ISelectRangeAction) { 
                if (!driver.selecting) {
                    return false;
                }
                const { cellKey } = value;
                const ranges = driver.config.selected = driver.config.selected || [];
                if (ranges.length) {
                    // 当前range一定是最后一个range
                    const cur = ranges[ranges.length - 1];
                    const newrange = { from: cur.from, to: cellKey };
                    if (driver.getRangeRelation(newrange, cur) === "same") {
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
} as ITableService;