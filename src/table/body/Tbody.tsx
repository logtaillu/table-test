/** tbody */
import React from 'react'
import { observer } from 'mobx-react-lite'
import { useDriver } from '../DriverContext';
import TableRow from '../row/TableRow';
export default observer(function () {
    const driver = useDriver();
    return (
        <tbody className={driver.prefix("tbody")}>
            {(driver.tableProps.data || []).map((data, idx) => {
                const key = driver.tableProps.rowkey ? driver.tableProps.rowkey(data, idx) : `body-${idx}`;
                return <TableRow key={key} data={data} rowtype="body" row={idx} columns={driver.renderCols} />;
            })}
        </tbody>
    )
})