/**
 * 监听column改变，并修改driver内容
 * 1. 处理columns，获取表头深度deep，列数columnCount
 * 2. 获取底层columns Array
 * 3. 获取thead渲染用的column数组
 */
import React, { useEffect } from 'react'
import { IMultiRangeSetter } from '../interfaces/IDriverCache';
import { ICellRange } from '../interfaces/IGlobalType';
import { IColumn, IColumnGroup, IColumnList, IRenderCol } from '../interfaces/ITableProps';
import { useDriver } from '../table/DriverContext'
import { deepMapAry, getDeep } from '../utils/baseUtil';
export default function (columns: IColumnList) {
    const driver = useDriver();
    useEffect(() => {
        const setary: IMultiRangeSetter = [];
        // 1. header深度
        const deep = getDeep(columns);
        setary.push({ value: deep, path: ["deep"], type: "wrap" });
        // 2. 更新colCount,更新width配置，获取渲染列
        let columnCount = driver.getValue("wrap", ["colCount"]);
        let headerCols: IRenderCol[][] = [];
        let renderCols: IRenderCol[] = [];
        const merged: ICellRange[] = [];
        const handleColumns = ({ item, x, y, isLeaf, rowspan, colspan }) => {
            // 更新colCount
            columnCount = Math.max(x + 1, columnCount);
            const col: IRenderCol = {
                ...item, isLeaf,
                row: y, col: x,
                rowSpan: rowspan,
                colSpan: colspan
            }
            const range = { col: col.col };
            // 转化align和width
            if (isLeaf) {
                renderCols.push(col);
                setary.push({ type: "colcell", path: ["--ev-ah"], value: col.align, grange: "body", range });
                setary.push({ type: "colcell", path: ["--ev-ah"], value: col.align, grange: "header", range });
                setary.push({ type: "col", path: ["colWidth"], value: col.width, range });

            } else {
                setary.push({ type: "cell", path: ["--ev-ah"], value: col.align, range });
            }
            if (rowspan > 1 || colspan > 1) {
                const mergedRange: ICellRange = {
                    from: { col: x, row: y, type: "header" },
                    to: { col: x + colspan, row: y + rowspan, type: "header" }
                };
                merged.push(mergedRange);
            }
            headerCols[y] = headerCols[y] || [];
            headerCols[y].push(col);
            return {};
        };
        deepMapAry<IColumnGroup | IColumn>(columns, handleColumns, deep);
        setary.push({ value: columnCount, path: ["colCount"], type: "wrap" });
        driver.setValues(setary);
        driver.cache.merged = driver.cache.merged || [];
        driver.cache.merged = driver.cache.merged.filter(s => s.from.type === "header");
        merged.map(mr => driver.cache.merged?.push(mr));
        driver.renderCols = renderCols; // 底层
        driver.columns = headerCols; // 渲染表头
    }, [columns]);
}