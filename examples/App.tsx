import React, { useState } from 'react'
import { DataTable, ExcelTable } from "../src";
import { IDataTableProps } from '../src/components/DataTable';
import { IExcelTableProps } from '../src/components/ExcelTable';
const getData = (str: string, num: number) => {
    const keys = str.split("");
    let res: any[] = [];
    for (let i = 0; i < num; i++) {
        let row: any = {};
        keys.map((k, idx) => row[k] = `${k}-${idx}-${num}`);
        res.push(row);
    }
    return res;
}
export default function () {
    const [exConf] = useState<IExcelTableProps>({
        toolbar: true,
        config: {
            rowCount: 5,
            colCount: 5,
            all: {
                row: { rowHeight: 40 },
                col: { colWidth: 100 }
            }
        },
        editable: true,
        data: getData("abcde", 6),
        columns: "abcde".split("").map(k => ({ title: k, dataIndex: k })),
    });
    const [dataConf] = useState<IDataTableProps>({
        toolbar: true,
        data: getData("abcde", 6),
        columns: "abcde".split("").map(k => ({ title: k, dataIndex: k })),
        editable: true
    });
    return (
        <div style={{ padding: 30, background: "#f5f5f5" }}>
            <h1>data table</h1>
            <DataTable {...dataConf} />
            <h1>excel table</h1>
            <ExcelTable {...exConf} />
        </div>
    )
}