/** table部分 */
import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite';
import { useDriver } from './DriverContext';
import THead from './header/Thead';
import ColGroup from './header/ColGroup';
import Tbody from './body/Tbody';
import useTotalWidth from '../hooks/useTotalWidth';
export default observer(function ({ width }: { width }) {
    const driver = useDriver();
    const layoutcls = driver.tableProps.tableLayout === "fixed" ? "table-fixed" : "table-auto";
    const wfull = useTotalWidth(width);
    return (
        <table
            className={`${driver.prefix("table")} ${layoutcls} ${wfull}`}
        >
            <ColGroup />
            {driver.tableProps.showHeader !== false ? <THead /> : null}
            <Tbody />
        </table>
    )
})