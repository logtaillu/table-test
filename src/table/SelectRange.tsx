import { observer } from 'mobx-react-lite';
import React from 'react'
import EvDriver from '../driver/EvDriver';
import { ICellRange } from '../interfaces/IGlobalType';
import { getCellKey } from '../utils/keyUtil';
import { useDriver } from './DriverContext';
export interface ISelectRangeProps {
}

const OneRange = observer((props: { range: ICellRange }) => {
    const { range } = props;
    const driver = useDriver();
    const { from, to } = range;
    const top = driver.getLength(null, from, "row");
    const left = driver.getLength(null, from, "col");
    const width = driver.getLength(from, to, "col");
    const height = driver.getLength(from, to, "row");
    // 边框宽度1
    const borderWidth = "var(--ex-range-width)";
    const style = {
        left: `calc( ${left}px - ${borderWidth} / 2 )`,
        top: `calc( ${top}px - ${borderWidth} / 2 )`,
        width: `calc( ${width}px + ${borderWidth} )`,
        height: `calc( ${height}px + ${borderWidth} )`
    }

    return <div className={driver.prefix("range")} style={style} />;
})

export default observer(function (props: ISelectRangeProps) {
    const driver = useDriver();
    return (
        <div className={driver.prefix("select-ranges")}>
            {driver.formatedSelected.map((range) => {
                const key = `${getCellKey(range.from)}-to-${getCellKey(range.to)}`;
                return <OneRange key={key} range={range} />;
            })}
        </div>
    )
});