import React, { useState } from 'react'
import { ExcelTable } from "../src";
import "../src/styles/index.less";
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
    return (
        <div style={{ padding: 30, background: "#f5f5f5" }}>
            <h1>data table</h1>
            <h1>excel table</h1>
            <ExcelTable
                editable={true}
                toolbar={true}
            />
        </div>
    )
}