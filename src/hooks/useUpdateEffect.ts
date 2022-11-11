import { useEffect, useRef } from "react";

export default (func: any, dep: any[]) => {
    const isMounted = useRef(false);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            func();
        }
    }, dep);
}