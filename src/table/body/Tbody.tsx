/** tbody */
import React from 'react'
import { observer } from 'mobx-react-lite'
import { useDriver } from '../DriverContext';
import TableRow from '../row/TableRow';
import { getValue } from '../../utils/valueUtil';
import { toJS } from 'mobx';
export default observer(function () {
    const driver = useDriver();
    const cssvar = toJS(getValue(driver.content, ["body", "cell", "cssvar"]));
    const cls = driver.prefix("tbody");
    return (
        <tbody className={cls} style={cssvar}>
            {(driver.data || []).map((data, idx) => {
                const key = driver.rowkey ? driver.rowkey(data, idx) : `body-${idx}`;
                return <TableRow key={key} data={data} rowtype="body" row={idx} columns={driver.renderCols} />;
            })}
        </tbody>
    )
})