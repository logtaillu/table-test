import React, { useEffect, useRef } from 'react'
import { observer } from "mobx-react-lite";
import { IRenderCol } from '../../interfaces/ITableProps';
import AutoHeightComponent from './AutoHeightComponent';
import { useDriver } from '../DriverContext';
import { Resizable } from 'react-resizable';
import useResize from '../../hooks/useResize';
import { getColKey } from '../../utils/keyUtil';
export interface IHeaderCell {
    data: IRenderCol;
}

const Th = observer((props: React.PropsWithChildren<IHeaderCell>) => {
    const { children, data } = props;
    const ref = useRef<Element>(null);
    const driver = useDriver();
    const resizeable = (driver.editable && props.data.isLeaf);
    const { width } = useResize(ref, !resizeable);
    useEffect(() => {
        if (width >= 0) {
            driver.setSize(getColKey({col: data.col}), width);
        }
    }, [width, data.col]);
        const userProps = data.onHeader ? data.onHeader(data) : {};
        const headerProps = {
            className: data.className,
            style: data.style,
            colSpan: data.colSpan,
            rowSpan: data.rowSpan,
            ...userProps
        }
    return (
        <AutoHeightComponent
            ref={ref}
            component="th"
            type="header"
            handle={children}
            props={headerProps}
            row={data.row}
            col={data.col}
        >
            {data.title}
        </AutoHeightComponent>
    )
});

export default observer((props: IHeaderCell) => {
    const driver = useDriver();
    const { data } = props;
    const resizeable = (driver.editable && props.data.isLeaf);
    const colKey = ({ col: data.col });
    const size = driver.sizes[getColKey(colKey)];
    const start = (e: any, s: any) => {
        const val = Math.round(s.size.width);
        driver.setSize(getColKey(colKey), val);
        driver.exec("sizeChange", { range: colKey, colWidth: val }, true);
    };
    const stop = (e: any, s: any) => {
        const val = Math.round(s.size.width);
        driver.setSize(getColKey(colKey), val);
        driver.exec("sizeChange", { range: colKey, colWidth: val }, false);
    };

    if (!resizeable || !size) {
        return <Th {...props} />;
    } else {
        return (
            <Resizable
                draggableOpts={{ enableUserSelectHack: false }}
                width={size}
                height={0}
                onResizeStart={start}
                onResize={start}
                onResizeStop={stop}

            >
                <Th {...props} />
            </Resizable>
        )
    }
});