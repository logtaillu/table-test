import React from 'react'
import { IGlobalRange } from '../interfaces/IGlobalType';
import { IToolbarItemObj } from '../interfaces/IToolbar';
const keys: IGlobalRange[] = ["all", "body", "header"];
/**@description 全局范围选择，包含全部/表头/header选项 */
export const globalRange: IToolbarItemObj = {
    key: "globalRange",
    icon: true,
    getValue: ({driver})=>driver.tableProps.globalRange,
    source: keys.map(k => ({ value: k, label: k })),
    onClick: ({ value, driver }) => {
        driver.tableProps.globalRange = value;
    }
}