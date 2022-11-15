/** 表格核心入口，初始化driver和intl，执行enrichProps */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { observer } from "mobx-react-lite";
import { ITableProps } from '../interfaces/ITableProps';
import { IntlProvider } from 'react-intl';
import EvDriver from '../driver/EvDriver';
import { DriverContext, useDriver } from './DriverContext';
import Toolbar from './toolbar/Toolbar';
import useUpdateEffect from '../hooks/useUpdateEffect';
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
    const { content, editable, lang, globalRange, maxStack, prefixCls, locales, className, style, items, sources, toolbar, columns, ...innerProps } = props;
    const driver = useDriver();
    // 配置改变
    useEffect(() => { driver.content = content }, [content]);
    // 其他改变
    useEffect(() => {
        driver.update({ prefixCls, editable, lang, globalRange, maxStack });
    }, [prefixCls, editable, lang, globalRange, maxStack]);
    // columns
    useColumn(columns || []);
    const setRef = (n: HTMLDivElement) => {
        driver.tableRef = n;
    }
    return (
        <IntlProvider locale={driver.lang} defaultLocale={defaultLang} messages={getMessages(lang, locales)}>
            <div className={driver.prefix("wrapper") + " " + (className || "")} style={{ ...getValue(driver.content, ["all", "cell", "cssvar"]), ...style }}>
                <Toolbar items={items} sources={sources} toolbar={toolbar} />
                <div ref={setRef} className={driver.prefix("table-core")}>
                    <Table {...innerProps} />
                </div>
            </div>
        </IntlProvider>
    )
}));