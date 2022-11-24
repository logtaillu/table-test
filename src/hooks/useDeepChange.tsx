// 更新对比
import { useObserver } from 'mobx-react-lite';
import React, { useRef } from 'react'
const deepEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length === b.length) {
            return a.findIndex((val, idx) => !deepEqual(val, b[idx])) < 0;
        }
        return false;
    } else if (a && b && typeof (a) === "object" && typeof (b) === "object") {
        const keysa = Object.keys(a);
        const keysb = Object.keys(b);
        if (keysa.length === keysb.length) {
            return keysa.findIndex(k => a[k] !== b[k]) < 0;
        }
        return false;
    } else {
        return a === b;
    }
}
export default function (func) {
    const preRef = useRef<any>(null);
    const result = func();
    const equal = deepEqual(preRef.current, result);
    if (!equal) {
        preRef.current = result;
    }
    return preRef.current;
}