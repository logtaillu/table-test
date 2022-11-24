/** 表头 */
import React from 'react'
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite'
import { getValue } from '../../utils/valueUtil';
import { useDriver } from '../DriverContext';
import TableRow from '../row/TableRow';
export default observer(function () {
    const driver = useDriver();
    const cssvar = toJS(getValue(driver.content, ["header", "cell", "cssvar"]));
    const cls = driver.prefix("thead");
        return (
            <thead className={cls} style={cssvar}>
                {driver.columns.map((columns, idx) => {
                    return <TableRow key={idx + "header"} columns={columns} rowtype="header" row={idx} />;
                })}
            </thead>
        )
})