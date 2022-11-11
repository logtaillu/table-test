/**
 * 工具栏
 */
import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { IToolbarItem } from '../toolbarItems/IToolbarItem';
import ToolbarItem from '../toolbarItems/ToolbarItem';
import { useDriver } from './DriverContext';
import ToolbarOperation from './ToolbarOperation';
export interface IActionToolbarProps {
    /**@description 自定义工具栏 */
    items?: IToolbarItem[];
    /**@description 自定义资源表 */
    sources?: Record<string, any>;
    /**@description 是否有工具栏 */
    toolbar?: boolean;
}
/**@description 工具栏 */
export default observer(function (props: IActionToolbarProps) {
    const { toolbar, items, sources } = props;
    const driver = useDriver();
    if (!toolbar || !driver.editable) {
        return null;
    }
    const list = (items || []).map((item, idx) => {
        const target = ToolbarItem.item(item);
        if (!target) {
            return <div key={idx} />;
        } else {
            return <ToolbarOperation key={target.key} driver={driver} target={target} sources={sources} />;
        }
    });
    return (
        <div className={driver.prefix("toolbar")}>
            {list}
        </div>
    )
});