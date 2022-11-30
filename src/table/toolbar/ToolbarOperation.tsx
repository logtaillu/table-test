/** 工具栏单项 */
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { useIntl } from 'react-intl';
import { IToolbarItem, IToolbarItemObj } from '../../interfaces/IToolbar'
import { useDriver } from '../context/DriverContext';
export default observer(function ({ item }: { item: IToolbarItem }) {
    const driver = useDriver();
    const intl = useIntl();
    const target = driver.props.getToolbarItem(item);
    const mode: IToolbarItemObj["mode"] = target.dropdown ? "dropdown" : (target.mode || "btn");
    // dropdown展开状态
    const [open, setOpen] = useState(false);
    // 临时值存储
    const [temp, setTemp] = useState(null);

    return <div></div>
});