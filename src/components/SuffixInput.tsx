/** 后缀input */
import React from 'react'
import InputNumber, { IInputNumber } from "./InputNumber";
import Dropdown from 'rc-dropdown';
export interface ISuffixInput extends IInputNumber {
    /** 后缀集合 */
    suffixs: string[];
    /** 数字类型的默认后缀 */
    nosuffix: string;
}
export default function (props: ISuffixInput) {
    const { value, suffixs, nosuffix, callback, ...others } = props;
    let num: string | number = "";
    let suffix = nosuffix;
    if (typeof (value) === "number") {
        [num, suffix] = [value, suffix];
    } else if (typeof (value) === "string") {
        const target = suffixs.find(s => value.endsWith(s));
        if (target) {
            const val = Number(value.replace(new RegExp(target + "$"), ""));
            [num, suffix] = [!isNaN(val) ? "" : val, target];
        }
    }
    const changeSuffix = val => {
        callback(num + val);
    }
    const changeValue = val => {
        callback(val + suffix);
    }
    const menu = (
        <ul className='toolbar-menu'>
            {suffixs.map(sf => <li key={sf} value={sf} onClick={() => changeSuffix(sf)}>
                <a className={sf === suffix ? "active" : ""}>{sf}</a>
            </li>)}
        </ul>
    )
    return (
        <div className='flex'>
            <InputNumber {...others} value={num} callback={changeValue} />
            <Dropdown trigger="click" overlay={menu}>
                <button className='toolbar-btn'>{suffix}</button>
            </Dropdown>
        </div>
    )
}