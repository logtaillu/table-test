/** 仿照rc-resize-observer的元素监听 */
import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { observeEle, unobserveEle } from '../utils/resizeUtil';

export default function (ref: RefObject<Element>, disabled: boolean = false) {
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
        if (size.width !== fixedWidth && size.height !== fixedHeight && size.offsetWidth !== offsetWidth && size.offsetHeight !== offsetHeight) {
            setSize({
                width: fixedWidth,
                height: fixedHeight,
                offsetHeight,
                offsetWidth
            });
        }
     }, []);
    useEffect(() => { 
        if (ref.current && !disabled) {
            observeEle(ref.current,onResize);
        }
        return () => {
            if (ref.current) {
                unobserveEle(ref.current, onResize);
            }
        }
    }, [ref.current, disabled]);
    return size;
}