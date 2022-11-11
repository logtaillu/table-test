/**
 * 工具栏
 */
import React from 'react'
import { observer } from 'mobx-react-lite';
import { useDriver } from './DriverContext';
import ToolbarOperation from './ToolbarOperation';
import toolbars from '../toolbars';
import { ITableProps } from '../interfaces/ITableProps';

/** 工具栏组 */
const ToolBarGroup = observer<{group, table}>(({ group, table }) => {
    const items = (group || []).map(item => {
        return <ToolbarOperation key={item.key} table={table} item={item} />;
    })
    return (
        <div className={"toolbar-group"}>
            {items}
        </div>
    )
})

/**@description 工具栏 */
export default observer(function ({ table }: { table: ITableProps }) {
    const { toolbar, items, sources } = table;
    const driver = useDriver();
    if (!toolbar || !driver.editable) {
        return null;
    }
    return (
        <div className={driver.prefix("toolbar")}>
            {(items || []).map((itemGroup, idx) => {
                return <ToolBarGroup table={table} group={itemGroup} key={idx} />;
            })}
        </div>
    )
});