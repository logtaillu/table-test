import React, { useRef, useState, useEffect } from 'react'
export interface IBlurInput extends React.InputHTMLAttributes<HTMLInputElement> {
    /**@description 值 */
    value: any;
    /**@description 回调，不占用onChange */
    callback: (value: any) => void;
    /**@description 是否blur触发回调 */
    blur?: boolean;
    /**@description 是否去除首位空格 */
    trim?: boolean;
    /**@description 是否允许空格 */
    space?: boolean;
    /**@description 自定义value处理*/
    handleValue?: (value) => any;
}
/** @description 文本输入框 */
export default function (props: IBlurInput) {
    const { value, callback, blur = true, trim = true, space = true, className = "", onChange, onBlur, handleValue: userHandle, ...others } = props;
    const ime = useRef(false);
    const [temp, setTemp] = useState(value);
    useEffect(() => {
        setTemp(value);
     }, [value]);
    // 值回调
    const handleValue = e => {
        let value: string = (e.target.value || "").toString();
        if (ime.current) {
            // 输入法进行中
            return value;
        }
        if (trim) {
            value = value.trim();
        }
        if (!space) {
            value = value.replace(/\s/g, "");
        }
        if (userHandle) {
            value = userHandle(value);
        }
        return value;
    }
    const change = e => {
        const val = handleValue(e);
        setTemp(val);
        if (!blur) {
            callback(val);
        }
        if (onChange) {
            onChange(e);
        }
    }
    const blurFunc = e => {
        ime.current = false;
        if (blur) {
            const val = handleValue(e);
            setTemp(val);
            callback(val);
        }
        if (onBlur) {
            onBlur(e);
        }
    }
    // 输入法控制
    const onCompositionStart = () => {
        ime.current = true;
    }
    const onCompositionEnd = e => {
        ime.current = false;
        change(e);
    }
    return <input
        type="text"
        value={temp}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        className={"tool-input " + className}
        onChange={change}
        onBlur={blurFunc}
        {...others}
    />;
}