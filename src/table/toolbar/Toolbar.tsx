/** 工具栏 */
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useDriver } from '../context/DriverContext';
import ToolbarGroup from './ToolbarGroup';
export default observer(function (props) {
    const driver = useDriver();
    if (!driver.props.toolbar || !driver.props.items) {
        return null;
    }
    return (
        <div className={driver.props.prefix("toolbar")}>
            {driver.props.items.map((itemGroup, idx) => {
                   return <ToolbarGroup group={itemGroup} key={idx} />;
            })}
        </div>
    )
})