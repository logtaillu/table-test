import ContentStore from ".";
import { IDriverCache } from "../../interfaces/IDriverCache";
import { IRenderCol, ITableProps } from "../../interfaces/ITableProps";
import { getDeep } from "../../utils/baseUtil";
import { getRowKey } from "../../utils/keyUtil";
/** 获取初始内容 */
export function getInitCache(): IDriverCache{
    return {
        data: {},
        all: {
            row: { autoHeight: true, rowHeight: 40 },
            // col: { colWidth: 100 },
            cell: {
                cssvar: {
                    "--ev-fsz": 12, // 因为scale计算，这里用number
                    "--ev-ff": "Microsoft YaHei",
                    "--ev-fc": "#666",
                    "--ev-ah": "center",
                    "--ev-av": "middle",
                    "--ev-bg": "transparent",
                    "--ev-fw": "normal",
                    "--ev-fsy": "normal",
                    "--ev-dr": "none",
                    "--ev-pl": "0px",
                    "--ev-pr": "0px",
                    "--ev-pt": "0px",
                    "--ev-pb": "0px",
                },
                borderType: "all",
                borderColor: "#377CFB",
                borderStyle: "solid",
                borderWidth: "1px"
            }
        },
        rowCount: 0,
        colCount: 0
    };
}
/** 简单的初始配置写入 */
export function mergeByTarget(target: any, info: any) {
    Object.keys(info).map(key => {
        const cur = target[key];
        const val = info[key];
        if (cur && typeof (cur) === "object" && !Array.isArray(cur)) {
            mergeByTarget(cur, val);
        } else if(!target[key]){
            target[key] = val;
        }
    })
}


export function initStore(store: ContentStore, content: ITableProps["content"], data: ITableProps["data"], cols: ITableProps["columns"], rowkey: ITableProps["rowkey"]) {
    // 1. 将initCache merge到store
    content = content || {};
    mergeByTarget(content, getInitCache());

    const { insertCols = [], insertRows = [], hiddenCols = [], hiddenRows = [], rowCount = 0, colCount = 0 } = content;
    // header相关量：cols/hiddenCols/insertCols/colCount
    // 2. 表头深度
    const deep = getDeep(cols || []);

    // 表头处理
    const columns: IRenderCol[][] = [];
    const flatCols: IRenderCol[] = [];

    // data相关量：data/rowkey/insertRows/hiddenRows/rowCount
    const rows: Array<{
        key: string,
        record?: any
    }> = [];
    const hiddens = {};
    store.rowKeyMap.clear();
    const getKey = rowkey || ((record, row) => getRowKey({ row: row.toString(), type: "body" }));
    (data || []).map((record, idx) => {
        const key = getKey(record, idx);
        rows.push({ key, record });
    });

    // 补充行
    const totalRows = content.rowCount = Math.max(content.rowCount || 0, rows.length);
    const start = rows.length;
    for (let i = start; i < totalRows; i++){
        rows.push({ key: getKey(null, i) });
    }

    store.content = content;
    store.columns = columns;
    store.flatCols = flatCols;
    store.rows = rows;
}