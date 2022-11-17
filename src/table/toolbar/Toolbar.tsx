/**
 * 工具栏
 */
import React from 'react'
import { observer } from 'mobx-react-lite';
import { useDriver } from '../DriverContext';
import ToolbarOperation from './ToolbarOperation';
import { ITableProps } from '../../interfaces/ITableProps';

/** 工具栏组 */
const ToolBarGroup = observer<{ group, sources }>(({ group, sources }) => {
    const items = (group || []).map((item, idx) => {
        const key = typeof (item) === "string" ? item : (item.key || idx);
        return <ToolbarOperation key={key} sources={sources} item={item} />;
    })
    return (
        <div className={"toolbar-group"}>
            {items}
        </div>
    )
})

/**@description 工具栏 */
export default observer(function (props: Pick<ITableProps, "toolbar" | "items" | "sources">) {
    const { toolbar, items, sources } = props;
    const driver = useDriver();
    console.log("up toolbar");
    if (!toolbar || !driver.tableProps.editable) {
        return null;
    }
    return (
        <div className={driver.prefix("toolbar")}>
            {(items || []).map((itemGroup, idx) => {
                return <ToolBarGroup sources={sources} group={itemGroup} key={idx} />;
            })}
        </div>
    )
});