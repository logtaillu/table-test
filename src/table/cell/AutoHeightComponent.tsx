/**
 * 自动高度组件
 */
import { observer } from 'mobx-react-lite';
import React from 'react'
import { ICellType } from '../../interfaces/IGlobalType';
import { getCellCssVars } from '../../utils/borderUtil';
import { useDriver } from '../DriverContext';
export interface IAutoHeightComponent {
    component: "td" | "th";
    row: number;
    col: number;
    type: ICellType;
}
export default observer((props: any & IAutoHeightComponent) => {
    const { component: Component, row, col, type, children, className, style, ...others } = props;
    const cellkey = { row, col, type };
    const driver = useDriver();
    const autoHeight = driver.getValue("row", "autoHeight", cellkey);
    const rowHeight = driver.getValue("row", "rowHeight", cellkey);
    const rowSpan = others.rowSpan || 1;
    const font = driver.getValue("cell", ["cssvar","--ev-fsz"], cellkey);
    const fontcss = font >= 12 ? "normal-font" : "small-font";
    const cellvars = getCellCssVars(driver, cellkey);
    // 防止children是纯文本,再包一层确保在自动高度时撑开高度
    const hstyle = {
        maxHeight: autoHeight ? "auto" : `calc( ${rowSpan * rowHeight}px - var(--ev-bwt) - var(--ev-bwb) )`
    }
    return (
        <Component {...others} className={`${fontcss} ${className || ""}`} style={{ ...style, ...cellvars }}>
            <div className="overflow-hidden" style={hstyle}>
                <div>
                    {children}
                </div>
            </div>
        </Component>
    )
})