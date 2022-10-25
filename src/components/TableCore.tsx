import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { observer } from "mobx-react-lite";
import TableDriver from '../tableDriver/TableDriver';
import InnerTable from './InnerTable';
import SelectRange from './SelectRange';
import Toolbar, { IActionToolbarProps } from './Toolbar';
import { IGlobalRange, ITableCacheConfig } from '../tableDriver/ITableDriver';
import { ITableService } from '../services/ITableService';
import { TableProps } from 'rc-table/lib/Table';
import "../styles/main.css";
import "../styles/index.less";
import { IntlProvider } from 'react-intl';
import messages from "../locales/index";
export interface IThemeVar extends React.CSSProperties {
    "--border-color": string;
    "--border-width": string;
    "--border-type": string;
    [key: string]: any;
}
export interface ITableCoreProps extends TableProps<any>, Pick<IActionToolbarProps, "toolbar" | "items" | "sources"> {
    /**@description 自定义配置 */
    config?: ITableCacheConfig;
    /**@description 启用的功能 */
    services?: ITableService[];
    /**@description 编辑状态 */
    editable?: boolean;
    /**@description 主题var变量配置，同时包含外层style */
    theme?: IThemeVar;
    /**@description 外层className */
    wrapClassName?: string;
    /**@description 当前语言 */
    lang?: string;
    /**@description 自定义语言文本 */
    locales?: Record<string, any>;
    /**@description 默认的全局设置范围 */
    globalRange?: IGlobalRange;
}
const getMessages = (lang?: string, locales?: Record<string, any>) => {
    lang = lang || "zh-CN";
    return {
        ...(messages[lang] || messages["zh-CN"]),
        ...(locales ? (locales[lang] || locales["zh-CN"]) : {})
    }
}
const useUpdateEffect = (func: any, dep: any[]) => {
    const isMounted = useRef(false);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            func();
        }
    }, dep);
}
export default observer(React.forwardRef(function (props: ITableCoreProps, ref) {
    const { config, services, toolbar, wrapClassName, theme, lang, locales, editable, globalRange, items, sources, ...tableProps } = props;
    const { prefixCls } = tableProps;
    const [driver] = useState(() => new TableDriver({ prefixCls, lang: navigator.language || lang, editable, config: config || {}, globalRange }));
    // config对象change，重置，指object本身，内部值改变不重置
    useUpdateEffect(() => { 
        driver.content = config;
    }, [config]);
    useUpdateEffect(() => { driver.cls = prefixCls }, [prefixCls]);
    useUpdateEffect(() => { driver.language = lang }, [lang]);
    useUpdateEffect(() => { driver.edit = editable }, [editable]);
    useUpdateEffect(() => { driver.range = globalRange }, [globalRange]);
    // 挂载services的actions
    useEffect(() => {
        if (services) {
            driver.register(services);
        }
        return () => {
            driver.remove();
        }
    }, [services]);
    const setRef = (n: HTMLDivElement) => {
        driver.tableRef = n;
    }

    // ref函数,备用
    useImperativeHandle(ref, () => ({

    }));
    return (
        <IntlProvider locale={driver.lang} defaultLocale="zh-CN" messages={getMessages(lang, locales)}>
            <div className={driver.prefix("table-wrapper") + " " + (wrapClassName || "")} style={theme || {}}>
                <Toolbar driver={driver} toolbar={toolbar} items={items} sources={sources} />
                <div ref={setRef} className={driver.prefix("inner-table")}>
                    <InnerTable driver={driver} table={tableProps} services={services} />
                    <SelectRange driver={driver} />
                </div>
            </div>
        </IntlProvider>
    )
}));