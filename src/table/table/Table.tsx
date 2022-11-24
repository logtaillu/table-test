/** table部分 */
import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite';
import { useDriver } from '../DriverContext';
import THead from '../header/Thead';
import ColGroup from '../header/ColGroup';
import Tbody from '../body/Tbody';
import useTotalWidth from '../../hooks/useTotalWidth';
import { ITableProps } from '../../interfaces/ITableProps';
import useResize from '../../hooks/useResize';
import classNames from 'classnames';
import { toJS } from 'mobx';
import { getValue } from '../../utils/valueUtil';
export default observer(function (props: ITableProps) {
    const driver = useDriver();
    const { expand, editable, scroll, tableLayout, showHeader } = props;
    const tableRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        driver.tableRef = tableRef.current;
    }, [tableRef.current]);
    const { width } = useResize(tableRef);
    const corecls = classNames({
        [driver.prefix("table-core")]: true,
        scroll: scroll,
        expand: expand,
        resizing: editable
    });

    const layoutcls = tableLayout === "fixed" ? "table-fixed" : "table-auto";
    const wfull = useTotalWidth(width, expand || false);
    const tableCls = `${driver.prefix("table")} ${layoutcls} ${wfull}`;
    // 因为直接取值，可以被driver控制
    const cssvar = toJS(getValue(driver.content, ["all", "cell", "cssvar"]));
    return (
        <div ref={tableRef} className={corecls} style={cssvar}>
            <table
                className={tableCls}
            >
                <ColGroup />
                {showHeader !== false ? <THead /> : null}
                <Tbody />
            </table>
        </div>
    )
})