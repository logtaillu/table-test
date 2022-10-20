import React from 'react'
import { IToolbarItemObj } from "./IToolbarItem";
import classnames from "classnames";
import { IGlobalRange } from '../tableDriver';
const keys: IGlobalRange[] = ["all", "body", "header"];
export const globalRange: IToolbarItemObj = {
    key: "globalRange",
    icon: ({ driver, intl }) => <span className="px-2">{intl.formatMessage({ id: driver.globalRange })} </span>,
    tooltip: ({ intl }) => intl.formatMessage({ id: "globalRange" }),
    listmode: ({driver})=>driver.globalRange,
    source: keys.map(k => ({ value: k, label: k })),
    onClick: ({ value, driver }) => {
        driver.setConf({ globalRange: value });
    }
}