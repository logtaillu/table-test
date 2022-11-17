import React, { useState } from 'react'
import { observer } from "mobx-react-lite";
import { Resizable } from "react-resizable";
import { useDriver } from '../DriverContext';
import { ICellType, IRowKey } from '../../interfaces/IGlobalType';
import { IRenderCol } from '../../interfaces/ITableProps';
import HeaderCell from '../cell/HeaderCell';
import BodyCell from '../cell/BodyCell';
export interface ITableRow {
    /** 行类型 */
    rowtype: ICellType;
    /** 行号 */
    row: number;
    columns: IRenderCol[] | any[];
}
export default observer((props: ITableRow) => {
    const driver = useDriver();
    const resizeable = driver.tableProps.editable;
    const { rowtype, row, columns, ...others } = props;
    const rowkey: IRowKey = { row, type: rowtype };
    const size: any = driver.getValue("row", ["rowHeight"], rowkey);
    const [temp, setTemp] = useState(-1);
    const Component = rowtype === "header" ? HeaderCell : BodyCell;
    const getProps = rowtype === "header" ? driver.tableProps.onHeaderRow : driver.tableProps.onRow;
    const rowProps = getProps ? getProps(columns as any, rowkey) : {};
    const childs = columns.map((col, index) => {
        const key = Array.isArray(col.dataIndex) ? col.dataIndex.join(".") : col.dataIndex || col.key;
        return <Component data={col} key={key} row={row} col={index} />
    });
    if (!resizeable || !size) {
        return (
            <tr {...others as any} {...rowProps} {...{ height: size }}>
                {childs}
            </tr>
        );
    } else {
        const start = (e: any, s: any) => {
            const val = s.size.height;
            setTemp(val);
        }
        const stop = (e: any, s: any) => {
            const val = s.size.height;
            if (val !== size) {
                driver.exec("sizeChange", { range: rowkey, rowHeight: val });
            }
            setTemp(-1);
        }
        const sizeval = temp >= 0 ? temp : size;
        const append = { height: sizeval };
        return (
            <Resizable
                draggableOpts={{ enableUserSelectHack: false }}
                width={0}
                height={sizeval}
                onResizeStart={start}
                onResize={start}
                onResizeStop={stop}

            >
                <tr {...others as any} {...rowProps} {...append}>
                    {childs}
                </tr>
            </Resizable>
        )
    }
})