/** table入口，控制driver注册和回传，处理外部props */
import { observer } from 'mobx-react-lite';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import EvDriver from '../../driver/EvDriver';
import useDeepChange from '../../hooks/useDeepChange';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import { ITableProps, ITableRef } from '../../interfaces/ITableProps';
import logUtil from '../../utils/logUtil';
import { DriverContext } from '../context/DriverContext';
import TableWrapper from './TableWrapper';
const enrichProps = (props: ITableProps) => {
    const { plugins, ...others } = props;
    let result = { ...others };
    (plugins || []).map(p => {
        if (p.enrich) {
            result = p.enrich(result);
        }
    });
    return result;
};
export default observer(React.forwardRef<ITableRef, ITableProps>(function (props, ref) {
    const plugins = props.plugins;
    props = useDeepChange(enrichProps(props));
    const { driver: pdriver, content, debug, maxStack, lang, locales, prefixCls, style, className, editable, items, sources } = props;
    const [driver, setDriver] = useState(() => pdriver || new EvDriver());

    // 日志
    useEffect(() => {
        logUtil.change(debug || false);
    }, [debug]);

    // driver更新
    useUpdateEffect(() => {
        if (pdriver) {
            setDriver(pdriver);
        }
    }, [pdriver]);
    // 挂载插件
    useEffect(() => {
        if (plugins) {
            driver.action.register(plugins);
        }
        return () => {
            driver.action.remove();
        }
    }, [plugins]);
    // 更新
    useEffect(() => { driver.content.refresh(content); }, [content]);
    useEffect(() => { driver.action.maxStack = maxStack }, [maxStack]);
    useEffect(() => { 
        driver.props.update({ lang, locales, prefixCls, style, className, editable });
    }, [lang, locales, prefixCls, style, className, editable, items, sources]);

    // ref，将driver提供出去
    useImperativeHandle(ref, () => ({
        driver: driver
    }));

    logUtil.log("render", "TableCore");

    return (
        <DriverContext.Provider value={driver}>
            <TableWrapper/>
        </DriverContext.Provider>
    );
}));