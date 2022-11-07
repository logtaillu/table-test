import React from 'react'
// import { ImFontSize, ImFont, ImTextColor } from 'react-icons/im'
import { IToolbarItemObj } from './IToolbarItem'
import { ChromePicker } from 'react-color';
import { AiOutlineBgColors, AiOutlineFontColors } from 'react-icons/ai';
// 字号
const defaultFontSizes = [6, 8, 9, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 64];
export const fontSize: IToolbarItemObj = {
    key: "fontSize",
    icon: true,
    // icon: <ImFontSize />,
    tooltip: "fontSize",
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-font-size"]),
    source: defaultFontSizes.map(k => ({ value: k, label: k.toString() })),
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-font-size": value });
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
    tooltip: "fontFamily",
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-font-family"]),
    source: defaultFontFamily,
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-font-family": value });
    }
}

// 颜色
export const fontColor: IToolbarItemObj = {
    key: "fontColor",
    icon: <AiOutlineFontColors />,
    tooltip: "fontColor",
    dropdown: ({ driver, value, setValue }) => {
        const change = (color, events) => {
            setValue(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
        }
        return <ChromePicker color={value} onChange={change} />;
    },
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-font-color"]),
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-font-color": value });
    }
}
// 背景色
export const backgroundColor: IToolbarItemObj = {
    key: "backgroundColor",
    tooltip: "backgroundColor",
    icon: <AiOutlineBgColors />,
    dropdown: ({ driver, value, setValue }) => {
        const change = (color, events) => {
            setValue(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
        }
        const swapChange = e => {
            const checked = e.target.checked;
            setValue(checked ? "transparent" : "#fff");
        }
        return (
            <div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">透明</span>
                        <input type="checkbox" className="toggle toggle-primary" checked={value === "transparent"} onClick={swapChange} />
                    </label>
                </div>
                <ChromePicker color={value} onChange={change} />
            </div>
        );
    },
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-background"]),
    onClick: ({ value, driver }) => {
        driver.exec("styleChange", { "--cell-background": value });
    }
}