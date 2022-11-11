/** 表格核心 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { observer } from "mobx-react-lite";
import { ITableProps } from '../interfaces/ITableProps';
import { IntlProvider } from 'react-intl';
import EvDriver from '../driver/EvDriver';
import { DriverContext } from './DriverContext';
import Toolbar from './Toolbar';
import useUpdateEffect from '../hooks/useUpdateEffect';
import messages from "../locales/index";
import Table from './Table';
import { getValue } from '../utils/valueUtil';
const defaultLang = "zh-CN";
const getMessages = (lang?: string, locales?: Record<string, any>) => {
    lang = lang || defaultLang;
    return {
        ...(messages[lang] || messages[defaultLang]),
        ...(locales ? (locales[lang] || locales[defaultLang]) : {})
    }
}

export default observer(React.forwardRef(function (props: ITableProps, ref) {
    const { content, editable, lang, globalRange, maxStack, prefixCls, locales, plugins, className, style, items, sources, toolbar } = props;
    const [driver] = useState(() => new EvDriver({ content, editable, lang: lang || navigator.language, globalRange, maxStack, prefixCls }));
    // 配置改变
    useUpdateEffect(() => { driver.content = content }, [content]);
    // 其他改变
    useUpdateEffect(() => {
        driver.update({ prefixCls, editable, lang, globalRange, maxStack });
    }, [prefixCls, editable, lang, globalRange, maxStack]);

    // 挂载插件
    useEffect(() => {
        if (plugins) {
            driver.register(plugins);
        }
        return () => {
            driver.remove();
        }
    }, [plugins]);
    const setRef = (n: HTMLDivElement) => {
        driver.tableRef = n;
    }

    // ref函数,备用
    useImperativeHandle(ref, () => ({

    }));
    return (
        <IntlProvider locale={driver.lang} defaultLocale={defaultLang} messages={getMessages(lang, locales)}>
            <DriverContext.Provider value={driver}>
                <div className={driver.prefix("wrapper") + " " + (className || "")} style={{ ...getValue(driver.content, ["all", "cell", "cssvar"]), ...style }}>
                    <Toolbar items={items} sources={sources} toolbar={toolbar} />
                    <div ref={setRef} className={driver.prefix("table")}>
                        <Table />
                    </div>
                </div>
            </DriverContext.Provider>
        </IntlProvider>
    )
}));