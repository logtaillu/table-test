/** 语言控制和组件摆放 */
import React from 'react';
import { observer } from 'mobx-react-lite';
import { defaultLang } from "../../locales/index";
import { IntlProvider } from 'react-intl';
import { useDriver } from '../context/DriverContext';
import logUtil from '../../utils/logUtil';
import { toJS } from 'mobx';
import Toolbar from '../toolbar/Toolbar';
import Table from '../table/Table';
export default observer(function () {
    const driver = useDriver();
    const messages = driver.props.getMessages();
    const wrapperCls = driver.props.prefix("wrapper") + " " + driver.props.className;
    const style = toJS(driver.props.style);
    logUtil.log("render", "TableWrapper");
    return (
        <IntlProvider
            defaultLocale={defaultLang}
            messages={messages}
            locale={driver.props.lang}
        >
            <div className={wrapperCls} style={style}>
                {/* <Toolbar/> */}
                <div className={driver.props.prefix("inner")}>
                    <Table/>
                </div>
            </div>
        </IntlProvider>
    )
});