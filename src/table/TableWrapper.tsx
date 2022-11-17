/** 表格核心入口，初始化driver和intl，执行enrichProps */
import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { ITableProps } from '../interfaces/ITableProps';
import { IntlProvider } from 'react-intl';
import { useDriver } from './DriverContext';
import Toolbar from './toolbar/Toolbar';
import messages from "../locales/index";
import Table from './Table';
import { getValue } from '../utils/valueUtil';
import useColumn from '../hooks/useColumn';
const defaultLang = "zh-CN";
const getMessages = (lang?: string, locales?: Record<string, any>) => {
    lang = lang || defaultLang;
    return {
        ...(messages[lang] || messages[defaultLang]),
        ...(locales ? (locales[lang] || locales[defaultLang]) : {})
    }
}

export default observer(React.forwardRef(function (props: ITableProps, ref) {
    const { content, locales, className, style, items, sources, toolbar, columns, ...p } = props;
    const driver = useDriver();
    // 配置改变
    useEffect(() => { driver.content = content }, [content]);
    // 其他改变
    useEffect(() => {
        driver.update(p);
    }, [p.editable, p.prefixCls, p.maxStack, p.lang, p.globalRange, p.showHeader, p.tableLayout, p.data, p.onRow, p.onHeaderRow]);
    // columns
    useColumn(columns || []);
    const setRef = (n: HTMLDivElement) => {
        driver.tableRef = n;
    }
    const lang = driver.tableProps.lang || defaultLang;
    console.log("up wrapper");
    return (
        <IntlProvider locale={lang} defaultLocale={defaultLang} messages={getMessages(lang, locales)}>
            <div className={driver.prefix("wrapper") + " " + (className || "")} style={{ ...getValue(driver.content, ["all", "cell", "cssvar"]), ...style }}>
                <Toolbar items={items} sources={sources} toolbar={toolbar} />
                <div ref={setRef} className={driver.prefix("table-core")}>
                    <Table />
                </div>
            </div>
        </IntlProvider>
    )
}));