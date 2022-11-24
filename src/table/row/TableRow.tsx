import { useEffect, useRef, useState } from 'react'
import { observer } from "mobx-react-lite";
import { Resizable } from "react-resizable";
import { useDriver } from '../DriverContext';
import { ICellType, IRowKey } from '../../interfaces/IGlobalType';
import { IRenderCol } from '../../interfaces/ITableProps';
import useResize from '../../hooks/useResize';
import { getRowKey } from '../../utils/keyUtil';
import HeaderList from './HeaderList';
import BodyList from './BodyList';
export interface ITableRow {
    /** 行类型 */
    rowtype: ICellType;
    /** 行号 */
    row: number;
    columns: IRenderCol[];
    data?: any;
}
export default observer((props: ITableRow) => {
    const driver = useDriver();
    const ref = useRef<Element>(null);
    const resizeable = driver.editable;
    const { height } = useResize(ref, !resizeable);
    const { rowtype, row, columns } = props;
    const rowkey: IRowKey = ({ row, type: rowtype });
    useEffect(() => {
        if (height > 0) {
            driver.setSize(getRowKey(rowkey), height);
        }
    }, [height, rowkey]);
    const size: any = driver.getValue("row", ["rowHeight"], rowkey);
    const [temp, setTemp] = useState(-1);
    const getProps = rowtype === "header" ? driver.onHeaderRow : driver.onRow;
    // 自定义参数
    const rowProps = getProps ? getProps(columns as any, rowkey) : {};

    // 子元素渲染
    const list = rowtype === "header" ? <HeaderList {...props} /> : <BodyList {...props} />;


    const start = (e: any, s: any) => {
        const val = s.size.height;
        setTemp(val);
    }
    const stop = (e: any, s: any) => {
        const val = s.size.height;
        if (val !== size) {
            driver.exec("sizeChange", { range: rowkey, rowHeight: val });
        }
        setTemp(-1);
    }

    if (!resizeable || !size) {
        return (
            <tr data-row={getRowKey(rowkey)} {...rowProps} {...{ height: size }}>
                {list}
            </tr>
        );
    } else {
        const sizeval = temp >= 0 ? temp : size;
        const append = { height: sizeval };
        const HandleEle = rowtype === "header" ? "th" : "td";
        return (
            <Resizable
                draggableOpts={{ enableUserSelectHack: false }}
                width={0}
                height={sizeval}
                onResizeStart={start}
                onResize={start}
                onResizeStop={stop}
                handle={<HandleEle className='react-resizable-handle' />}
            >
                <tr data-row={getRowKey(rowkey)} {...rowProps} {...append}>
                    {list}
                </tr>
            </Resizable>
        )
    }
})