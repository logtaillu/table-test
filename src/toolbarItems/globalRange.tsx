import React from 'react'
import { IGlobalRange } from '../tableDriver/ITableDriver';
import { IToolbarItemObj } from "./IToolbarItem";
const keys: IGlobalRange[] = ["all", "body", "header"];
/**@description 全局范围选择，包含全部/表头/header选项 */
export const globalRange: IToolbarItemObj = {
    key: "globalRange",
    icon: ({ driver, intl }) => <span className="px-2">{intl.formatMessage({ id: driver.globalRange })} </span>,
    tooltip: "globalRange",
    listmode: ({driver})=>driver.globalRange,
    source: keys.map(k => ({ value: k, label: k })),
    onClick: ({ value, driver }) => {
        driver.range = value;
    }
}