import { useDriver } from "../components/DriverContext";
import { IBorderType, ICellCssVars, ICellKey, ICellType, IConfigKey, IGlobalBorderConfig, IRangeSetAry } from "../tableDriver/ITableDriver";
import { observer } from "mobx-react-lite";
import { getValue } from "../tableDriver/ValueFunc";
import { ITableService } from "./ITableService";
import { borderKeys, getCellBorder } from "../utils/borderUtil";
/**样式设置和实现
 * 样式用cssvar形式，给每层设置cssvar style
 * used by ExcelTable,DataTable
 */
const getWrapper = (cellType: ICellType) => {
    return observer<any>(props => {
        const { style, ...others } = props;
        const driver = useDriver();
        const cssVars = getValue(driver.config, [cellType, "cell", "cssvars"]);
        const Component = cellType === "body" ? "tbody" : "thead";
        return <Component {...others} style={{ ...style, ...cssVars }} />;
    })
}
const components = {
    header: {
        wrapper: getWrapper("header")
    },
    body: {
        wrapper: getWrapper("body")
    }
};
const getClearKeys = key => {
    return borderKeys.map(k => ["cssvars", `--cell-b-${key}-${k}`]);
}
const clearKeys = {
    borderType: borderKeys.map(k=>[`b${k}`]),
    borderColor: getClearKeys("color"),
    borderStyle: getClearKeys("style"),
    borderWidth: getClearKeys("width")
}
// border相关
/**
 * 1. get selected range or all range
 * 2. foreach cell
 * 3. use cellkey and setValue and border type to get config set ary
 * 4. merged cell 需要判断是否在边上
 */



export default {
    enrichProps(tableProps, driver) {
        return {
            // 全局样式(all)
            style: { ...driver.config.all?.cell?.cssvars },
            // body/header
            components
        };
    },
    actions: {
        // 样式改变设置 
        styleChange: {
            exec(driver, value) {
                const confs: IRangeSetAry = [];
                const range = value.range || false;
                const keys = Object.keys(value).filter(s => s !== "range") as IConfigKey[];
                keys.map(key => {
                    confs.push({ type: "cell", key: ["cssvars", key], value: value[key], range });
                });
                return driver.setMultiRangeValue(confs);
            },
        },
        // 边框设置
        borderChange: {
            exec(driver, value: Partial<IGlobalBorderConfig>) {
                let confs: IRangeSetAry = [];
                if (driver.selected) {
                    (driver.config.selected || []).map(range => {
                        const cells = driver.getCellListInRanges([range]);
                        cells.map(cell => {
                            const ary = getCellBorder(driver, cell, range, value);
                            confs = confs.concat(ary);
                        });// end map cell
                    }) // end map range
                } else {
                    const keys = Object.keys(value) as Array<keyof IGlobalBorderConfig>;
                    keys.map(key => confs.push({
                        type: "cell", key: [key], value: value[key],
                        clearKeys: clearKeys[key]
                    }))
                }
                return driver.setMultiRangeValue(confs);
            }
        }
    }
} as ITableService;