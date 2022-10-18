import React from 'react'
import { observer } from 'mobx-react-lite';
import TableDriver from '../tableDriver';
import { ICellRange } from '../tableDriver/ITableDriver';
export interface ISelectRangeProps {
    driver: TableDriver;
}

const getRangeStyle = (range: ICellRange, driver: TableDriver): React.CSSProperties => {
    const table = driver.tableRef;
    if (!table) {
        return {};
    }
    const fromcell = table.querySelector(`[data-cellkey=${driver.getCellKey(range.from)}]`);
    const tocell = table.querySelector(`[data-cellkey=${driver.getCellKey(range.to)}]`);
    if (!fromcell || !tocell) {
        return {};
    }
    const fromrect = fromcell.getBoundingClientRect();
    const torect = tocell.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();
    // 边框宽度1
    const borderWidth = 1;
    const left = Math.min(fromrect.left, torect.left);
    const top = Math.min(fromrect.top, torect.top);
    const right = Math.max(fromrect.right, torect.right);
    const bottom = Math.max(fromrect.bottom, torect.bottom);
    return {
        left: (left - borderWidth - tableRect.left) + "px",
        top: (top - borderWidth - tableRect.top) + "px",
        width: (right - left + borderWidth) + "px",
        height: (bottom - top + borderWidth) + "px"
    }
}

export default observer(function (props: ISelectRangeProps) {
    const { driver } = props;
    
    return (
        <div className={driver.prefix("select-ranges")}>
            {driver.selectedShowRanges.map((range) => {
                const key = `${driver.getCellKey(range.from)}-to-${driver.getCellKey(range.to)}`;
                const style = getRangeStyle(range, driver);
                return <div className={driver.prefix("range")} key={key} style={style} />;
            })}
        </div>
    )
});