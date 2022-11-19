/** 列宽部分，因为thead有可能不展示 */
import { observer } from 'mobx-react-lite'
import React from 'react'
import { getValue } from '../../utils/valueUtil';
import { useDriver } from '../DriverContext';
import TableRow from '../row/TableRow';
export default observer(function () {
    const driver = useDriver();
    const cssvar = getValue(driver.content, ["header", "cell", "cssvar"]);
    return (
        <thead className={driver.prefix("thead")} style={cssvar}>
            {driver.columns.map((columns, idx) => {
                return <TableRow key={idx + "header"} columns={columns} rowtype="header" row={idx} />;
            })}
        </thead>
    )
})