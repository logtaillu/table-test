/** 仿照rc-resize-observer的元素监听 */
import { useObserver } from 'mobx-react-lite';
import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { observeEle, unobserveEle } from '../utils/resizeUtil';
export interface IUseResize {
    /** 是否启用 */
    disabled?: boolean;
    /** 是否在监听宽度改变 */
    handleW?: boolean;
    /** 是否监听高度改变 */
    handleH?: boolean;
}

export default function (ref: RefObject<Element>, options: IUseResize) {
    const { disabled, handleW, handleH } = options;
    const [size, setSize] = useState({
        width: -1,
        height: -1,
        offsetWidth: -1,
        offsetHeight: -1
    });
    const onResize = useCallback((target: HTMLElement) => {
        const { width, height } = target.getBoundingClientRect();
        let { offsetWidth, offsetHeight } = target;
        const fixedWidth = Math.floor(width);
        const fixedHeight = Math.floor(height);
        offsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
        offsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;
        const wChange = handleW !== false && (size.width !== fixedWidth || size.offsetWidth !== offsetWidth);
        const hChange = handleH !== false && (size.height !== fixedHeight || size.offsetHeight !== offsetHeight);
        if (wChange || hChange) {
            setSize({
                width: fixedWidth,
                height: fixedHeight,
                offsetHeight,
                offsetWidth
            });
        }
     }, [handleW, handleH]);
    useEffect(() => { 
        if (ref.current && !disabled) {
            observeEle(ref.current, onResize);
            // 初始触发一次
            onResize(ref.current as any);
        }
        return () => {
            if (ref.current) {
                unobserveEle(ref.current, onResize);
            }
        }
    }, [ref.current, disabled]);
    return useObserver(() => size);
}