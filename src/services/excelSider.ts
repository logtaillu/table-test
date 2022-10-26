import { ColumnType } from "rc-table/lib/interface";
import { ITableService } from "./ITableService";

/**
 * excel模式下给予上方和左侧的行列
 */
const getIdxName = (idx: number) => {
    const baseCode = 'A'.charCodeAt(0);
    let arr = [];
    do {
        const cur = idx % 26;
        arr.push(baseCode + cur);
        idx = Math.floor(idx / 26);
    } while (idx > 0);
    return String.fromCharCode(...arr);
}
export default {
    enrichProps(tableProps, driver) {
        const colCount = driver.config.colCount || 0;
        const oricols = tableProps.columns || [];
        const columns: ColumnType<any>[] = [];
        columns.push({
            title: "",
            dataIndex: "serial",
            render: (value, record, index) => index + 1
        });
        for (let i = 0; i < colCount; i++) {
            const ori = oricols[i] || {};
            columns.push({ dataIndex: i, ...ori, title: ori.title || getIdxName(i) });
        }
        return {
            columns
        };
    },
    actions: {},
    events: []
} as ITableService;