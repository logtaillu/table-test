import React, { useState } from 'react'
import { ChromePicker } from 'react-color';
export interface IColorPickerProps {
    value?: string;
    onChange: (value: string) => void;
    clearable?: boolean;
}
export default function (props: IColorPickerProps) {
    const { value, clearable, onChange } = props;
    const [temp, setTemp] = useState("#fff");
    const control = 'value' in props;
    const changeValue = val => {
        if (!control) {
            setTemp(val);
        }
        onChange(val);
    }
    const change = (color, events) => {
        changeValue(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
    }
    const swapChange = e => {
        const checked = e.target.checked;
        changeValue(checked ? "transparent" : "#fff");
    }
    const val = control ? value : temp;
    if (clearable) {
        return (
            <div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">透明</span>
                        <input type="checkbox" className="toggle toggle-primary" checked={val === "transparent"} onChange={swapChange} />
                    </label>
                </div>
                <ChromePicker color={val} onChange={change} />
            </div>
        );
    } else {
        return <ChromePicker color={val} onChange={change} />;
    }
}