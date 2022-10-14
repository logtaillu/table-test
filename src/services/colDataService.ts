import { TableProps } from "rc-table/lib/Table";
import { ITableService } from "./ITableService";
const ENRICH_COLUMN = "enrichCol";
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
                    dataIndex: `${ENRICH_COLUMN}${i}`
                });
            }
            append.columns = newcols;
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
        return append;
    },
    actions: {}
} as ITableService;