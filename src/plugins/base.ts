/** 内置的基础动作 */
import { IColConfig, IGlobalBorderConfig, IRowConfig } from "../interfaces/IConfig";
import { IConfigKey, IMultiRangeSetter } from "../interfaces/IDriverCache";
import { IRangeAryType } from "../interfaces/IGlobalType";
import { IEvPlugin } from "../interfaces/IPlugin";
import { borderKeys, getCellBorder } from "../utils/borderUtil";
import { getRangeCellList } from "../utils/rangeUtil";
type ISizeChangeValue = IRowConfig & IColConfig & { range?: IRangeAryType };
const getClearKeys = key => {
    return borderKeys.map(k => ["cssvars", `--ev-b${key}${k}`]);
}
const clearKeys: any = {
    borderType: borderKeys.map(k=>[`b${k}`]),
    borderColor: getClearKeys("c"),
    borderStyle: getClearKeys("s"),
    borderWidth: getClearKeys("w")
}
export default {
    actions: {
        // resize操作
        sizeChange: {
            exec(driver, value: ISizeChangeValue) {
                const confs: IMultiRangeSetter = [];
                const range = value.range || false;
                if ('autoHeight' in value) {
                    confs.push({ type: "row", path: "autoHeight", value: value.autoHeight, range });
                }
                if ('rowHeight' in value) {
                    confs.push({ type: "row", path: "rowHeight", value: value.rowHeight, range });
                }
                if ('colWidth' in value) {
                    confs.push({ type: "col", path: "colWidth", value: value.colWidth, range });
                }
                return driver.setValues(confs);
            }
        },
        // 样式改变设置 
        styleChange: {
            exec(driver, value) {
                const confs: IMultiRangeSetter = [];
                const range = value.range || false;
                const keys = Object.keys(value).filter(s => s !== "range") as IConfigKey[];
                keys.map(key => {
                    confs.push({ type: "cell", path: ["cssvar", key], value: value[key], range });
                });
                return driver.setValues(confs);
            },
        },
        // 边框设置
        borderChange: {
            exec(driver, value: Partial<IGlobalBorderConfig>) {
                let confs: IMultiRangeSetter = [];
                if (driver.selecting) {
                    (driver.content.selected || []).map(range => {
                        const cells = getRangeCellList([range], driver.merged, driver.content.deep || 0);
                        cells.map(cell => {
                            const ary = getCellBorder(driver, cell, range, value);
                            confs = confs.concat(ary);
                        });// end map cell
                    }) // end map range
                } else {
                    const keys = Object.keys(value) as Array<keyof IGlobalBorderConfig>;
                    keys.map(key => confs.push({
                        type: "cell", path: [key], value: value[key],
                        clears: clearKeys[key]
                    }))
                }
                return driver.setValues(confs);
            }
        }
    },
    events: [
        // 撤销
        {
            name: "keydown",
            key: "z",
            ctrl: true,
            func(driver, e) {
                driver.undo();
            },
        },
        // 重做
        {
            name: "keydown",
            key: "y",
            ctrl: true,
            func(driver, e) {
                driver.redo();
            },
        }
    ]
} as IEvPlugin;