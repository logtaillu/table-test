import React, { useMemo } from 'react'
import { useDriver } from "../table/DriverContext";

export default (width: number, expand: boolean) => {
    const driver = useDriver();
    let total = 0;
    let styled = false;
    if (!expand) {
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
    return styled ? total < width ? "" : "w-full" : "";
}