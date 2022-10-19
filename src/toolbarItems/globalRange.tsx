import React from 'react'
import { IToolbarItemObj } from "./IToolbarItem";
import classnames from "classnames";
import { IGlobalRange } from '../tableDriver';
const keys: IGlobalRange[] = ["all", "body", "header"];
export const globalRange: IToolbarItemObj = {
    key: "globalRange",
    icon: ({ driver, intl }) => <span>{intl.formatMessage({ id: driver.globalRange })} </span>,
    tooltip: ({ intl }) => intl.formatMessage({ id: "undo" }),
    dropdown: ({ driver, intl }) => {
        return (
            <ul className="menu whitespace-nowrap">
                {keys.map(key => {
                    const active = driver.globalRange === key;
                    const cls = classnames({ active, "py-4px": true });
                    const change = () => {
                        driver.globalRange = key;
                    }
                    return (
                        <li key={key} onClick={change}>
                            <a className={cls}>{intl.formatMessage({ id: key })}</a>
                        </li>
                    )
                })}
            </ul>
        )
    }
}