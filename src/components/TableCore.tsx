import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { observer } from "mobx-react-lite";
import TableDriver from '../tableDriver';
import InnerTable from './InnerTable';
import SelectRange from './SelectRange';
import Toolbar, { IActionToolbarProps } from './Toolbar';
import { ITableCacheConfig } from '../tableDriver/ITableDriver';
import { ITableService } from '../services/ITableService';
import { TableProps } from 'rc-table/lib/Table';
import "../styles/main.css";
import "../styles/index.less";
export interface IThemeVar extends React.CSSProperties {
    "--border-color": string;
    "--border-width": string;
    "--border-type": string;
}
export interface ITableCoreProps extends TableProps<any>, Pick<IActionToolbarProps, "toolbar"> {
    /**@description 自定义配置 */
    config?: ITableCacheConfig;
    /**@description 启用的功能 */
    services?: ITableService[];
    /**@description 主题var变量配置，同时包含外层style */
    theme?: IThemeVar;
    /**@description 外层className */
    wrapClassName?: string;
}
export default observer(React.forwardRef(function (props: ITableCoreProps, ref) {
    const { config, services, toolbar, wrapClassName, theme, ...tableProps } = props;
    const { prefixCls } = tableProps;
    const [driver] = useState(() => new TableDriver(config || {}, prefixCls));
    const isMounted = useRef(false);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    // config对象change，重置，指object本身，内部值改变不重置
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            driver.reset(config || {});
        }
    }, [config]);

    // prefixCls改变
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else if (typeof (prefixCls) === "string") {
            driver.prefixCls = prefixCls;
        }
    }, [prefixCls]);
    // 挂载services的actions
    useEffect(() => {
        (services || []).map(s => driver.registerActions(s.actions));
    }, [services]);
    const setRef = (n: HTMLDivElement) => {
        driver.tableRef = n;
    }

    // ref函数,备用
    useImperativeHandle(ref, () => ({

    }));

    return (
        <div className={driver.prefix("table-wrapper") + " " + (wrapClassName || "")} style={theme || {}}>
            <Toolbar driver={driver} toolbar={toolbar}/>
            <div ref={setRef} className={driver.prefix("inner-table")}>
                <InnerTable driver={driver} table={tableProps} services={services} />
                <SelectRange driver={driver} />
            </div>
        </div>
    )
}));