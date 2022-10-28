/**
 * 行高/列宽拖拽配置
 * a. 即时生效，end的时候pushStack
 * b. 列宽配在th上，行高配在tr上
 * c. 自动高度需要给cell
 */
import { TableProps } from 'rc-table/lib/Table';
import React, { useState } from 'react'
import { Resizable } from "react-resizable";
import 'react-resizable/css/styles.css';
import { ICellType, IColConfig, IRangeSetAry, IRowConfig, IRowKey, ISaveRange } from '../tableDriver/ITableDriver';
import { ITableService } from './ITableService';
type ISizeChangeValue = IRowConfig & IColConfig & { range?: ISaveRange };

const getResizeComponent = (Component: "tr" | "td" | "th", vertical: boolean) => {
    return (props: any) => {
        const { resizeable = false, size, onResize, ...rest } = props;
        const [temp, setTemp] = useState(-1);
        if (!resizeable || !size) {
            return <Component {...rest} />;
        } else {
            const start = (e: any, s: any) => {
                const val = s.size[vertical ? "height" : "width"];
                setTemp(val);
            }
            const stop = (e: any, s: any) => {
                const val = s.size[vertical ? "height" : "width"];
                if (val !== size) {
                    onResize(val);
                }
                setTemp(-1);
            }
            const sizeval = temp >= 0 ? temp : size;
            return (
                <Resizable
                    draggableOpts={{ enableUserSelectHack: false }}
                    width={vertical ? 0 : sizeval}
                    height={vertical ? sizeval : 0}
                    onResizeStart={start}
                    onResize={start}
                    onResizeStop={stop}

                >
                    <Component {...rest} />
                </Resizable>
            )
        }
    }
}
const ResizeableTh = getResizeComponent("th", false);
const ResizeableTr = getResizeComponent("tr", true);
const components = {
    header: {
        cell: ResizeableTh,
        row: ResizeableTr
    },
    body: { row: ResizeableTr }
};
export default {
    enrichProps(tableProps, driver) {
        const append: Partial<TableProps<any>> = {};
        // 列宽

        // 行高
        const rowfunc: any = (type: ICellType) => (data: any, index: number) => {
            const row: IRowKey = { index: index || 0, type };
            return {
                resizeable: driver.editable,
                size: driver.getRangeValue("row", "rowHeight", row),
                onResize(value: number) {
                    driver.exec("sizeChange", { range: row, rowHeight: value });
                },
                "data-rownum": index
            }
        }
        append.onHeaderRow = rowfunc("header");
        append.onRow = rowfunc("body");
        return {
            components,
            ...append
        };
    },
    actions: {
        sizeChange: {
            exec(driver, value: ISizeChangeValue) {
                const confs: IRangeSetAry = [];
                const range = value.range || false;
                if ('autoHeight' in value) {
                    confs.push({ type: "row", key: "autoHeight", value: value.autoHeight, range });
                }
                if ('rowHeight' in value) {
                    confs.push({ type: "row", key: "rowHeight", value: value.rowHeight, range });
                }
                if ('colWidth' in value) {
                    confs.push({ type: "col", key: "colWidth", value: value.colWidth, range });
                }
                return driver.setMultiRangeValue(confs);
            }
        }

    },
    events: []
} as ITableService;