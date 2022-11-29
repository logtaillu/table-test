/** 表格入口
 * 初始化driver，处理plugins更改props
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { observer } from "mobx-react-lite";
import { ITableCoreProps } from '../interfaces/ITableProps';
import EvDriver from '../driver/EvDriver';
import { DriverContext } from '../../src/table/context/DriverContext';
import TableWrapper from './TableWrapper';
import { mergeConfig } from '../utils/baseUtil';
import logUtil from '../utils/logUtil';

export default observer(React.forwardRef(function (props: ITableCoreProps, ref) {
    const { plugins, debug, ...tableProps } = props;
    // 建立范围内driver
    const [driver] = useState(() => new EvDriver());

    // 日志
    useEffect(() => {
        logUtil.change(debug || false);
     }, [debug]);
    
    // 挂载插件
    useEffect(() => {
        if (plugins) {
            driver.register(plugins);
        }
        return () => {
            driver.remove();
        }
    }, [plugins]);

    // 执行enrichProps
    const enrichProps = (info) => {
        let result = { ...info };
        (plugins || []).map(p => {
            if (p.enrich) {
                const temp = p.enrich(result, driver);
                result = mergeConfig(result, temp);
            }
        });
        return result;
    };
    const passToTable = enrichProps(tableProps);
    // ref，将driver提供出去
    useImperativeHandle(ref, () => ({
        driver: () => driver
    }));
    
    return (
        <DriverContext.Provider value={driver}>
            <TableWrapper {...passToTable} />
        </DriverContext.Provider>
    )
}));