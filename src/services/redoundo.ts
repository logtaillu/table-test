import { mapColumn } from "../utils/columnUtil";
import { ITableService } from "./ITableService";

/**redo/undo events
 * used by ExcelTable,DataTable(目前的target判断还生效不了)
 */
export default {
    events: [
        {
            name: "keydown",
            key: "z",
            ctrl: true,
            func(driver, e) {
                driver.undoAction();
            },
        },
        {
            name: "keydown",
            key: "y",
            ctrl: true,
            func(driver, e) {
                driver.redoAction();
            },
        }
    ]
} as ITableService;