import React, { useCallback, useEffect, useMemo, useRef } from 'react'
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

const Thead = observer((props: React.PropsWithChildren<IHeaderCell>) => {
    const { children, data } = props;
    const ref = useRef<Element>(null);
    const driver = useDriver();
    const resizeable = (driver.tableProps.editable && props.data.isLeaf);
    const { width } = useResize(ref, !resizeable);
    useEffect(() => {
        if (width >= 0) {
            driver.setSize(getColKey({col: data.col}), width);
        }
    }, [width, data.col]);
    const headerProps = useMemo(() => {
        const userProps = data.onHeader ? data.onHeader(data) : {};
        return {
            className: data.className,
            style: data.style,
            colSpan: data.colSpan,
            rowSpan: data.rowSpan,
            ...userProps
        }
    },[data]);
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
    const resizeable = (driver.tableProps.editable && props.data.isLeaf);
    const colKey = getColKey({ col: data.col });
    const size = driver.sizes[colKey];
    const start = useCallback((e: any, s: any) => {
        const val = s.size.width;
        driver.exec("sizeChange", { range: colKey, colWidth: val }, true);
    }, [colKey, driver]);
    const stop = useCallback((e: any, s: any) => {
        const val = s.size.width;
        driver.exec("sizeChange", { range: colKey, colWidth: val }, false);
    }, [colKey, driver]);

    if (!resizeable || !size) {
        return <Thead {...props} />;
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
                <Thead {...props} />
            </Resizable>
        )
    }
});