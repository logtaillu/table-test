/**
 * 行高/列宽拖拽配置
 * a. 即时生效，end的时候pushStack
 * b. 列宽配在th上，行高配在tr上
 * c. 自动高度需要给cell
 * d. 样式的生效
 * used by ExcelTable, DataTable
 */
import { observer } from "mobx-react-lite";
import React, { useState } from 'react'
import { Resizable } from "react-resizable";
import 'react-resizable/css/styles.css';
import { useDriver } from "../components/DriverContext";
import { IColConfig, IRangeSetAry, IRowConfig, IRowKey, ISaveRange } from '../tableDriver/ITableDriver';
import { getCellKeyObj, getRowKeyObj } from '../tableDriver/keyFunc';
import { getValue } from "../tableDriver/ValueFunc";
import { mapColumn } from "../utils/columnUtil";
import { ITableService } from './ITableService';
type ISizeChangeValue = IRowConfig & IColConfig & { range?: ISaveRange };

const ResizeableTr = observer((props: any) => {
    const driver = useDriver();
    const resizeable = driver.editable;
    const key = props["data-exrow"];
    const cell = key ? getRowKeyObj(key) : false;
    const size = driver.getRangeValue("row", "rowHeight", cell);
    const [temp, setTemp] = useState(-1);
    // 非resize或者没有设置size
    if (!resizeable || !size) {
        return <tr {...props} />;
    } else {
        const start = (e: any, s: any) => {
            const val = s.size.height;
            setTemp(val);
        }
        const stop = (e: any, s: any) => {
            const val = s.size.height;
            if (val !== size) {
                driver.exec("sizeChange", { range: cell, rowHeight: val });
            }
            setTemp(-1);
        }
        const sizeval = temp >= 0 ? temp : size;
        const append = { height: sizeval };
        return (
            <Resizable
                draggableOpts={{ enableUserSelectHack: false }}
                width={0}
                height={sizeval}
                onResizeStart={start}
                onResize={start}
                onResizeStop={stop}

            >
                <tr {...props} {...append} />
            </Resizable>
        )
    }
});
const getAutoHeightComponent = (Component: "td" | "th") => {
    return observer((props: any) => {
        const { children, className, style, ...others } = props;
        const driver = useDriver();
        const key = props["data-cellkey"];
        const cell = key ? getCellKeyObj(key) : false;
        const autoHeight = driver.getRangeValue("row", "autoHeight", cell);
        const rowHeight = driver.getRangeValue("row", "rowHeight", cell);
        const rowSpan = others.rowSpan || 1;
        const font = driver.getRangeValue("cell", ["cssvars", "--cell-font-size"], cell);
        const fontcss = font >= 12 ? "normal-font" : "small-font";
        const cellvars = getValue(driver.config, ["cell", key, "cssvars"]);
        // 防止children是纯文本,再包一层确保在自动高度时撑开高度
        return (
            <Component {...others} className={`${fontcss} ${className||""}`} style={{...style, ...cellvars}}>
                <div className="overflow-hidden" style={{ height: autoHeight ? "auto" : rowSpan * rowHeight }}>
                    <div>
                        {children}
                    </div>
                </div>
            </Component>
        )
    })
}
const Thead = getAutoHeightComponent("th");
const ResizeableTh = observer((props: any) => {
    const driver = useDriver();
    const resizeable = driver.editable;
    const key = props["data-cellkey"];
    const cell = key ? getCellKeyObj(key) : false;
    const size = driver.getRangeValue("col", "colWidth", cell);
    // 非resize或者没有设置size
    if (!resizeable || !size || !key) {
        return <Thead {...props} />;
    } else {
        const start = (e: any, s: any) => {
            const val = s.size.width;
            driver.exec("sizeChange", { range: cell, colWidth: val }, true);
        }
        const stop = (e: any, s: any) => {
            const val = s.size.width;
            driver.exec("sizeChange", { range: cell, colWidth: val }, false);
        }
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
const components = {
    header: {
        cell: ResizeableTh,
        row: ResizeableTr
    },
    body: {
        row: ResizeableTr,
        cell: getAutoHeightComponent("td")
    }
};
export default {
    enrichProps(tableProps, driver) {
        // 列宽
        return {
            components,
            columns: mapColumn(tableProps.columns || [], (col: any, cell, isLeaf) => {
                if (isLeaf) {
                    return {
                        // 先driver的width，然后配置的?
                        width: driver.getRangeValue("col", "colWidth", cell) || col.width
                    };
                } else {
                    return {};
                }
            })
        };
    },
    actions: {
        // 普通的sizeChange
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