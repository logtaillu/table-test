/** table部分 */
import React from 'react'
import { observer } from 'mobx-react-lite';
import { ITableProps } from '../interfaces/ITableProps';
import { useDriver } from './DriverContext';
import THead from './header/Thead';
import ColGroup from './header/ColGroup';
export default observer(function (props: Pick<ITableProps, "showHeader" | "tableLayout">) {
    const driver = useDriver();
    const layoutcls = props.tableLayout === "fixed" ? "table-fixed" : "table-auto";
    return (
        <table className={`${driver.prefix("table")} ${layoutcls}`}>
            <ColGroup/>
            {props.showHeader ? <THead /> : null}
        </table>
    )
})