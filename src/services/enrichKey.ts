import { mapColumn } from "../utils/columnUtil";
import { ITableService } from "./ITableService";

/**补充行、列key，基础功能
 * td/th添加data-cellkey,tr添加data-rownum，最后执行
 * used by ExcelTable,DataTable
 */
export default {
    enrichProps(tableProps, driver) {
        return {
            // 给cell添加data-cellkey
            columns: mapColumn(tableProps.columns || [], (col, cell, isLeaf) => {
                const append: any = {
                    onHeaderCell(column, index) {
                        return { "data-cellkey": driver.getCellKey(cell),   "data-col": driver.getColKey({ index: cell.col }) }
                    }
                };
                if (isLeaf) {
                    append.onCell = (record, index) => {
                        return {
                            "data-cellkey": driver.getCellKey({ type: "body", col: cell.col, row: index }),
                            "data-col": driver.getColKey({ index: cell.col })
                        }
                    }
                }
                return append;
            }),
            // 补充行数
            onHeaderRow(data, index) {
                return { "data-exrow": driver.getRowKey({ index: index || 0, type: "header" }) };
            },
            onRow(data, index) {
                return { "data-exrow": driver.getRowKey({ index: index || 0, type: "body" }) };
            }
        }
    }
} as ITableService;