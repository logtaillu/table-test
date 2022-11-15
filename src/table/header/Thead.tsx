/** 列宽部分，因为thead有可能不展示 */
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useDriver } from '../DriverContext';
export default observer(function () {
    const driver = useDriver();
    return (
        <thead>
            {/* {driver.columns.map((row, idx) => )} */}
        </thead>
    )
})