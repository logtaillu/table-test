import React from 'react'
import { ImFontSize } from 'react-icons/im'
import { IToolbarItemObj } from './IToolbarItem'
// 但是chrome最小12px
const defaultFontSizes = [6, 8, 9, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 64];
export const fontSize: IToolbarItemObj = {
    key: "fontSize",
    icon: <ImFontSize />,
    tooltip: "fontSize",
    listmode: ({ driver }) => driver.getRangeValue("cell", ["cssvars","--cell-font-size"]),
    source: defaultFontSizes.map(k => ({ value: k + "px", label: k.toString() })),
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-font-size": value });
    }
}