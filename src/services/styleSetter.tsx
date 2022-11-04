import { IConfigKey, IRangeSetAry } from "../tableDriver/ITableDriver";
import { ITableService } from "./ITableService";

/**样式设置和实现
 * 样式用cssvar形式，给每层设置cssvar style
 * used by ExcelTable,DataTable
 */
export default {
    enrichProps(tableProps, driver) {
        return {
            // 全局样式
            style: {...driver.config.all?.cell?.cssvars},

        };
    },
    actions: {
        /**样式改变设置 */
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
        }
    }
} as ITableService;