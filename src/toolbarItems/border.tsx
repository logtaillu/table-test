import React from 'react'
import { IToolbarItemObj } from './IToolbarItem'
import { MdBorderColor, MdBorderStyle } from "react-icons/md";
import { BsBorder, BsBorderAll, BsBorderCenter, BsBorderInner, BsBorderLeft, BsBorderMiddle, BsBorderOuter, BsBorderRight, BsBorderTop, BsBorderWidth } from "react-icons/bs";
import ColorPicker from '../dataComponents/ColorPicker';
// 边框线类型
export const borderType: IToolbarItemObj = {
    key: "borderType",
    icon: <BsBorderAll />,
    btnlist: true,
    source: [
        { value: "all", label: <BsBorderAll /> },
        { value: "none", label: <BsBorder /> },
        { value: "left", label: <BsBorderLeft /> },
        { value: "top", label: <BsBorderTop /> },
        { value: "right", label: <BsBorderRight /> },
        { value: "bottom", label: <BsBorderAll /> },
        { value: "outter", label: <BsBorderOuter /> },
        { value: "inner", label: <BsBorderInner /> },
        { value: "horinzontal", label: <BsBorderCenter /> },
        { value: "vertical", label: <BsBorderMiddle /> },
    ]
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
    ]
}
// 边框线粗细
export const borderWidth: IToolbarItemObj = {
    key: "borderWidth",
    icon: <BsBorderWidth />,
    source: [1, 2, 3].map(w => ({ value: w + "px", label: <div className='tool-line border-solid' style={{ borderTopWidth: w }} /> }))
}
// 边框线颜色
export const borderColor: IToolbarItemObj = {
    key: "borderColor",
    icon: <MdBorderColor />,
    dropdown: ({ driver, value, setValue }) => {
        return <ColorPicker onChange={setValue} clearable={true} />;
    },
    onClick: ({ driver, value }) => {
        // driver.exec({});
    }
}