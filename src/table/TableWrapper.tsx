/** 
 * 语言、toolbar和table布局，注册需要内部使用的props等
 */
import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { ITableProps } from '../interfaces/ITableProps';
import { IntlProvider } from 'react-intl';
import { useDriver } from './DriverContext';
import Toolbar from './toolbar/Toolbar';
import messages from "../locales/index";
import Table from './table/Table';
import useColumn from '../hooks/useColumn';
import SelectRange from './SelectRange';
const defaultLang = "zh-CN";
const getMessages = (lang?: string, locales?: Record<string, any>) => {
    lang = lang || defaultLang;
    return {
        ...(messages[lang] || messages[defaultLang]),
        ...(locales ? (locales[lang] || locales[defaultLang]) : {})
    }
}

export default observer(React.forwardRef(function (props: ITableProps, ref) {
    const {
        // 内部传递的量,lang是为了以后有语言切换的情况
        editable, prefixCls, maxStack, lang, globalRange, content,
        // table用
        // showHeader, tableLayout,
        data, onRow, onHeaderRow, columns, rowkey,
        // 滚动样式相关的
        // scroll, expand,
        // 外层样式
        className, style,
        // 语言
        locales,
        // toolbar用到的
        sources, items, toolbar
    } = props;
    const driver = useDriver();

    // 全局配置改变
    useEffect(() => {
        driver.update({
            editable, prefixCls, maxStack,
            lang, globalRange, content,
            onRow, onHeaderRow, rowkey, data
        });
    }, [editable, prefixCls, maxStack, lang, globalRange, content, onRow, onHeaderRow, rowkey, data]);
    // columns
    useColumn(columns || []);

    const langcur = driver.lang || defaultLang;
    const messages = getMessages(langcur, locales);

    return (
        <IntlProvider locale={langcur} defaultLocale={defaultLang} messages={messages}>
            <div className={driver.prefix("wrapper") + " " + (className || "")} style={style}>
                <Toolbar items={items} sources={sources} toolbar={toolbar} />
                <div className={driver.prefix("inner")}>
                    <Table {...props} />
                    <SelectRange />
                </div>
            </div>
        </IntlProvider>
    )
}));