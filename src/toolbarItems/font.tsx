import React from 'react'
// import { ImFontSize, ImFont, ImTextColor } from 'react-icons/im'
import { IToolbarItemObj } from './IToolbarItem'
import { ChromePicker } from 'react-color';
import { AiOutlineBgColors, AiOutlineFontColors } from 'react-icons/ai';
import { ImBold, ImItalic, ImUnderline } from 'react-icons/im';
import ColorPicker from '../dataComponents/ColorPicker';
// 字号
const defaultFontSizes = [6, 8, 9, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 64];
export const fontSize: IToolbarItemObj = {
    key: "fontSize",
    icon: true,
    // icon: <ImFontSize />,
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-f-size"]),
    source: defaultFontSizes.map(k => ({ value: k, label: k.toString() })),
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-f-size": value });
    }
}
// 字体
const defaultFontFamily = [
    { value: "Microsoft YaHei", label: "微软雅黑" },
    { value: "SimSun", label: "宋体" },
    { value: "KaiTi,STKaiti", label: "楷体" },
    { value: "SimHei,STHeiti", label: "黑体" },
    { value: "Arial Black", label: "Arial Black" }
];
export const fontFamily: IToolbarItemObj = {
    key: "fontFamily",
    icon: true,
    // icon: <ImFont />,
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-f-family"]),
    source: defaultFontFamily,
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-f-family": value });
    }
}

// 颜色
export const fontColor: IToolbarItemObj = {
    key: "fontColor",
    icon: <AiOutlineFontColors />,
    dropdown: ({ driver, value, setValue }) => {
        return <ColorPicker value={value} onChange={setValue} />;
    },
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-f-color"]),
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-f-color": value });
    }
}
// 背景色
export const backgroundColor: IToolbarItemObj = {
    key: "backgroundColor",
    tooltip: "backgroundColor",
    icon: <AiOutlineBgColors />,
    dropdown: ({ driver, value, setValue }) => {
        return <ColorPicker value={value} onChange={setValue} clearable={true} />;
    },
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-bg"]),
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-bg": value });
    }
}
// 粗体font-weight: bold;
export const bold: IToolbarItemObj = {
    key: "bold",
    icon: <ImBold />,
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-f-weight"]),
    active: ({ driver, value }) => value === "bold",
    onClick: ({ driver, value }) => {
        driver.exec("styleChange", { "--cell-f-weight": value === "bold" ? "normal" : "bold" });
    }
};
// 斜体font-style: italic;
export const italic: IToolbarItemObj = {
    key: "italic",
    icon: <ImItalic />,
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-f-style"]),
    active: ({ driver, value }) => value === "italic",
    onClick: ({ driver, value }) => {
        driver.exec("styleChange", { "--cell-f-style": value === "italic" ? "normal" : "italic" });
    }
};
// 下划线text-decoration: underline;
export const underline: IToolbarItemObj = {
    key: "underline",
    icon: <ImUnderline />,
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-decoration"]),
    active: ({ driver, value }) => value === "underline",
    onClick: ({ driver, value }) => {
        driver.exec("styleChange", { "--cell-decoration": value === "underline" ? "none" : "underline" });
    }
};