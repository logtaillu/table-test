import React from 'react'
import { MdBorderColor, MdBorderStyle } from "react-icons/md";
import { BsBorder, BsBorderAll, BsBorderBottom, BsBorderCenter, BsBorderInner, BsBorderLeft, BsBorderMiddle, BsBorderOuter, BsBorderRight, BsBorderTop, BsBorderWidth } from "react-icons/bs";
import ColorPicker from '../components/ColorPicker';
import { IToolbarItemObj } from '../interfaces/IToolbar';
// 边框线类型
export const borderType: IToolbarItemObj = {
    key: "borderType",
    icon: <BsBorderAll />,
    btnlist: true,
    source: [
        { value: "all", label: <BsBorderAll /> },
        { value: "none", label: <BsBorder /> },
        { value: "top", label: <BsBorderTop /> },
        { value: "right", label: <BsBorderRight /> },
        { value: "bottom", label: <BsBorderBottom /> },
        { value: "left", label: <BsBorderLeft /> },
        { value: "outter", label: <BsBorderOuter /> },
        { value: "inner", label: <BsBorderInner /> },
        { value: "horinzontal", label: <BsBorderCenter /> },
        { value: "vertical", label: <BsBorderMiddle /> },
    ],
    getValue: ({ driver }) => driver.haveSelectRange ? undefined : driver.getValue("cell", ["borderType"]),
    onClick: ({ driver, value }) => {
        driver.exec("borderChange", { bordeType: value });
    },
}

/**
 * 边框线样式/颜色/宽度取值逻辑
 * 外围元素外只持有右边线和下边线
 */
// 边框线样式
export const borderStyle: IToolbarItemObj = {
    key: "borderStyle",
    icon: <MdBorderStyle />,
    source: [
        {
            value: "hidden",
            label: "无边框线"
        },
        {
            value: "solid",
            label: <div className="border-solid tool-line" />
        },
        {
            value: "dashed",
            label: <div className="border-dashed tool-line" />
        },
        {
            value: "dotted",
            label: <div className="border-dotted tool-line" />
        }
    ],
    getValue: ({ driver }) => driver.haveSelectRange ? undefined : driver.getValue("cell", ["borderStyle"]),
    onClick: ({ driver, value }) => {
        driver.exec("borderChange", { borderStyle: value });
    },
}
// 边框线粗细
export const borderWidth: IToolbarItemObj = {
    key: "borderWidth",
    icon: <BsBorderWidth />,
    source: [1, 2, 3].map(w => ({ value: w + "px", label: <div className='tool-line border-solid' style={{ borderTopWidth: w }} /> })),
    getValue: ({ driver }) => driver.haveSelectRange ? undefined : driver.getValue("cell",[ "borderWidth"]),
    onClick: ({ driver, value }) => {
        driver.exec("borderChange", { borderWidth: value });
    },
}
// 边框线颜色
export const borderColor: IToolbarItemObj = {
    key: "borderColor",
    icon: <MdBorderColor />,
    dropdown: ({ driver, value, setValue }) => {
        return <ColorPicker value={value} onChange={setValue} clearable={true} />;
    },
    onClick: ({ driver, value }) => {
        driver.exec("borderChange", { borderColor: value });
    },
    getValue: ({ driver }) => driver.haveSelectRange ? undefined : driver.getValue("cell", ["borderColor"])
}