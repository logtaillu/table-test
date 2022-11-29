// 元素大小监听相关
import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type IResizeCallback = (ele: HTMLElement) => void;
const resizeHandlers: Map<Element, Set<IResizeCallback>> = new Map();
const resizeObserver = new ResizeObserver((entries, observer) => {
    entries.forEach(entry => {
        const target = entry.target;
        const funcs = resizeHandlers.get(target);
        if (funcs && funcs.size) {
            funcs.forEach(func => func(target));
        }
    });
});
/**添加监测函数 */
export const observeEle = (ele: Element, callback: IResizeCallback) => {
    if (!resizeHandlers.has(ele)) {
        resizeHandlers.set(ele, new Set([callback]));
        resizeObserver.observe(ele);
    } else {
        resizeHandlers.get(ele)?.add(callback);
    }
}
/** 取消监测函数 */
export const unobserveEle = (ele: Element, callback: IResizeCallback) => {
    if (resizeHandlers.has(ele)) {
        const setTarget = resizeHandlers.get(ele);
        setTarget?.delete(callback);
        if (!setTarget?.size) {
            resizeObserver.unobserve(ele);
            resizeHandlers.delete(ele);
        }
    }
}