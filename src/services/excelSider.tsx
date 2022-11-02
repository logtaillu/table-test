import React from 'react'
import { ColumnType } from "rc-table/lib/interface";
import { mapColumn } from "../utils/columnUtil";
import { ITableService } from "./ITableService";

/**
 * excel模式下给予上方和左侧的类excel行列
 * used by ExcelTable
 */
const getIdxName = (idx: number) => {
    const baseCode = 'A'.charCodeAt(0);
    let arr: number[] = [];
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
        let columns: ColumnType<any>[] = [];
        const cellcls = driver.prefix("serial-cell");
        columns.push({
            title: "",
            dataIndex: "serial",
            className: cellcls,
            width: 60,
            align:"center",
            render: (value, record, index) => index + 1,
            fixed: "left",
            except: true
        } as any);
        let start = 0;
        // 原有列
        const cols = mapColumn(oricols, (col: any, cell, isLeaf) => {
            if (isLeaf) {
                const append = {
                    dataIndex: 'dataIndex' in col ? col.dataIndex : start,
                    title: col.title || getIdxName(start),
                    className: `${col.className||""}`
                }
                start += 1;
                return append;
            } else {
                return {};
            }
        });
        // 补充列
        columns = columns.concat(cols);
        for (let i = start; i < colCount; i++) {
            columns.push({ dataIndex: i, title: getIdxName(i) });
        }
        return {
            columns
        };
    }
} as ITableService;