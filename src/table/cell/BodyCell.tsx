import React from 'react'
import { observer } from "mobx-react-lite";
import AutoHeightComponent from './AutoHeightComponent';
import { useDriver } from '../DriverContext';
import { getValue } from '../../utils/valueUtil';
export interface IBodyCell {
    data: any;
    col: number;
    row: number;
}
export default observer((props: IBodyCell) => {
    const { data, col, row } = props;
    const driver = useDriver();
    const column = driver.renderCols[col];
    const { rowSpan, colSpan } = driver.getMergedValue({ col, row, type: "body" });
    const userProps = column?.onCell ? column.onCell(data, row) : {};
    const cellProps = {
        rowSpan,
        colSpan,
        className: column.cellClassName,
        style: column.cellStyle,
        ...userProps
    }
    if (colSpan === 0 || rowSpan === 0) {
        return null;
    }
    const text = getValue(data, column.dataIndex);
    const child = column.renderCell ? column.renderCell(text, data, row) : text;
    return (
        <AutoHeightComponent
            component="td"
            type="body"
            props={cellProps}
            row={row}
            col={col}
        >
            {child}
        </AutoHeightComponent>
    );
});