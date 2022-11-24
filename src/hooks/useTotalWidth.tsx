import { useObserver } from 'mobx-react-lite';
import React from 'react'
import { useDriver } from "../table/DriverContext";

export default (width: number) => {
    const driver = useDriver();
    let total = 0;
    let styled = false;
    if (!driver.tableProps.expand) {
        styled = true;
        driver.renderCols.map(col => {
            const w = driver.getValue("col", "colWidth", { col: col.col });
            if (typeof (w) === "number") {
                total += w;
            } else {
                styled = false;
            }
        })
    }
    return useObserver(() => styled ? total < width ? "" : "w-full" : "");
}