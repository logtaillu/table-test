import React from 'react'
import { observer } from 'mobx-react-lite';
import TableDriver from '../tableDriver/TableDriver';
import { ICellKey, ICellRange } from '../tableDriver/ITableDriver';
import { useDriver } from './DriverContext';
export interface ISelectRangeProps {
}
const getRangeStyle = (range: ICellRange, driver: TableDriver): React.CSSProperties => {
    const { from, to } = range;
    const top = driver.getLength(null, from, "row");
    const left = driver.getLength(null, from, "col");
    const width = driver.getLength(from, to, "col");
    const height = driver.getLength(from, to, "row");
    // 边框宽度1
    const borderWidth = "var(--ex-range-width)";
    return {
        left: `calc( ${left}px - ${borderWidth} / 2 )`,
        top: `calc( ${top}px - ${borderWidth} / 2 )`,
        width: `calc( ${width}px + ${borderWidth} )`,
        height: `calc( ${height}px + ${borderWidth} )`
    }
}

export default observer(function (props: ISelectRangeProps) {
    const driver = useDriver();
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