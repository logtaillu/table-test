import { observer } from 'mobx-react-lite';
import React from 'react'
import { useDriver } from '../DriverContext';
import { useDrop } from "react-dnd";
import { ICellKey, IDragItem } from '../../interfaces/IGlobalType';
export interface IDropCellProps {
    cellKey: ICellKey;
}
export default observer(function (props: React.PropsWithChildren<IDropCellProps>) {
    const driver = useDriver();
    const onDrop = (item: IDragItem) => {
        if (driver.onDrop) {
            driver.onDrop(driver, props.cellKey, item);
        } else {
            driver.exec("value", { item, cell: props.cellKey });
        }
    }
    const [, drop] = useDrop({
        accept: driver.dropType || "tableCell",
        drop: onDrop,
        // collect: (monitor) => ({
        //     isOver: monitor.isOver(),
        //     canDrop: monitor.canDrop(),
        // }),
    })
    return (
        <td ref={drop}>
            {props.children}
        </td>
    )
})