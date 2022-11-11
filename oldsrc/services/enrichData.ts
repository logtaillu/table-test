import { TableProps } from "rc-table/lib/Table";
import { ITableService } from "./ITableService";
/**
 * 根据colCount,rowCount，补充最小行列数
 * used by ExcelTable
 */
export default {
    enrichProps: (props, driver) => {
        const { columns, data } = props;
        const rowCount = driver.config.rowCount || 0;
        const colCount = driver.config.colCount || 0;
        const collen = (columns || []).length;
        const append: TableProps<any> = {};
        // 补充列数
        if (colCount && collen < colCount) {
            const newcols = [...(columns || [])];
            for (let i = collen; i < colCount; i++) {
                newcols.push({
                    title: "",
                    dataIndex: i
                });
            }
            append.columns = newcols;
        }
        if ((columns?.length || 0) > colCount) {
            driver.setConfigValue("colCount", columns?.length || 0);
        }
        
        // 补充行数
        const datalen = (data || []).length;
        if (rowCount && datalen < rowCount) {
            const newdata = [...(data || [])];
            for (let i = datalen; i < rowCount; i++) {
                newdata.push({});
            }
            append.data = newdata;
        }
        if (datalen > rowCount) {
            driver.setConfigValue("rowCount", datalen);
        }
        return append;
    },
    actions: {}
} as ITableService;