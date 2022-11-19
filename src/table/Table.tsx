/** table部分 */
import React from 'react'
import { observer } from 'mobx-react-lite';
import { ITableProps } from '../interfaces/ITableProps';
import { useDriver } from './DriverContext';
import THead from './header/Thead';
import ColGroup from './header/ColGroup';
import Tbody from './body/Tbody';
export default observer(function () {
    const driver = useDriver();
    const layoutcls = driver.tableProps.tableLayout === "fixed" ? "table-fixed" : "table-auto";
    console.log("up table");
    return (
        <table className={`${driver.prefix("table")} ${layoutcls}`}>
            <ColGroup/>
            {driver.tableProps.showHeader !== false ? <THead /> : null}
            <Tbody/>
        </table>
    )
})