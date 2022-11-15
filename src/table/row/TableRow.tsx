import React from 'react'
import { observer } from "mobx-react-lite";
import { Resizable } from "react-resizable";
import { useDriver } from '../DriverContext';
import { ICellType } from '../../interfaces/IGlobalType';
export interface ITableRow extends HTMLTableRowElement{
    /** 行类型 */
    rowtype: ICellType;
    /** 行号 */
    row: number;
}
export default observer((props: ITableRow) => {
    const driver = useDriver();
    const resizeable = driver.editable;
    const { rowtype, row, ...others } = props;

    return <tr />;
})