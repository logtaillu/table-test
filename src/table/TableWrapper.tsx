/** 表格核心入口，初始化driver和intl，执行enrichProps */
import React, { useEffect, useMemo, useRef } from 'react';
import { observer, useObserver } from "mobx-react-lite";
import { ITableProps } from '../interfaces/ITableProps';
import { IntlProvider } from 'react-intl';
import { useDriver } from './DriverContext';
import Toolbar from './toolbar/Toolbar';
import messages from "../locales/index";
import Table from './Table';
import { getValue } from '../utils/valueUtil';
import useColumn from '../hooks/useColumn';
import classNames from 'classnames';
import useResize from '../hooks/useResize';
import { toJS } from 'mobx';
import logUtil from '../utils/logUtil';
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
    // 注册到driver控制的tableProps
    useEffect(() => {
        driver.update(p);
    }, [p.editable, p.prefixCls, p.maxStack, p.lang, p.globalRange, p.showHeader, p.tableLayout, p.data, p.onRow, p.onHeaderRow, p.data, p.rowkey]);
    // columns
    useColumn(columns || []);
    // 宽度处理
    const tableRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        driver.tableRef = tableRef.current;
     }, [tableRef.current]);
    const { width } = useResize(tableRef);
    const cls = classNames({
        scroll: p.scroll,
        expand: p.expand,
        resizing: p.editable
    });
    const lang = driver.tableProps.lang || defaultLang;
    const cssvar = toJS(getValue(driver.content, ["all", "cell", "cssvar"]));
    logUtil.log("render", "TableCore");
    return (
        <IntlProvider locale={lang} defaultLocale={defaultLang} messages={getMessages(lang, locales)}>
            <div className={driver.prefix("wrapper") + " " + (className || "")} style={style}>
                <Toolbar items={items} sources={sources} toolbar={toolbar} />
                <div ref={tableRef} className={`${driver.prefix("table-core")} ${cls}`} style={cssvar}>
                    <Table width={width} />
                </div>
            </div>
        </IntlProvider>
    )
}));