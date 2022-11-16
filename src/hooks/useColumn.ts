/**
 * 监听column改变，并修改driver内容
 * 1. 处理columns，获取表头深度deep，列数columnCount
 * 2. 获取底层columns Array
 * 3. 获取thead渲染用的column数组
 */
import React, { useEffect } from 'react'
import { IColumn, IColumnGroup, IColumnList, IRenderCol } from '../interfaces/ITableProps';
import { useDriver } from '../table/DriverContext'
import { deepMapAry, getDeep } from '../utils/baseUtil';
export default function (columns: IColumnList) {
    const driver = useDriver();
    useEffect(() => {
        // 1. header深度
        const deep = getDeep(columns);
        // 2. 更新colCount,更新width配置，获取渲染列
        let columnCount = driver.getValue("wrap", ["colCount"]);
        let headerCols: IRenderCol[][] = [];
        let renderCols: IRenderCol[] = [];
        const handleColumns = ({ item, x, y, isLeaf, rowspan, colspan }) => {
            // 更新colCount
            columnCount = Math.max(x, columnCount);
            const col: IRenderCol = {
                ...item, isLeaf,
                row: y, col: x,
                rowSpan: rowspan,
                colSpan: colspan
            }
            if (isLeaf) {
                renderCols.push(col);
            }
            headerCols[y] = headerCols[y] || [];
            headerCols[y].push(col);
            return {};
        };
        deepMapAry<IColumnGroup | IColumn>(columns, handleColumns, deep);
        driver.setValues([
            { value: deep, path: ["deep"], type: "wrap" },
            { value: columnCount, path: ["colCount"], type: "wrap" }
        ]);
        driver.renderCols = renderCols;
        driver.columns = headerCols;
        console.log(renderCols, headerCols);
    }, [columns]);
}