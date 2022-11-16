/** 表格核心入口，初始化driver和intl，执行enrichProps */
import React, { useEffect, useImperativeHandle, useState, useMemo } from 'react';
import { observer } from "mobx-react-lite";
import { ITableCoreProps } from '../interfaces/ITableProps';
import EvDriver from '../driver/EvDriver';
import { DriverContext } from './DriverContext';
import TableWrapper from './TableWrapper';
import { mergeConfig } from '../utils/baseUtil';

export default observer(React.forwardRef(function (props: ITableCoreProps, ref) {
    const { plugins, ...tableProps } = props;
    const [driver] = useState(() => new EvDriver());

    // 挂载插件
    useEffect(() => {
        if (plugins) {
            driver.register(plugins);
        }
        return () => {
            driver.remove();
        }
    }, [plugins]);
    // enrichProps
    const enrichProps = () => {
        let result = {...tableProps};
        (plugins || []).map(p => {
            if (p.enrich) {
                const temp = p.enrich(result, driver);
                result = mergeConfig(result, temp);
            }
        });
        return result;
    }
    const passToTable = useMemo(() => {
        return enrichProps();
     }, [driver, plugins]);

    // ref函数,备用
    useImperativeHandle(ref, () => ({

    }));
    return (
        <DriverContext.Provider value={driver}>
            <TableWrapper {...passToTable} />
        </DriverContext.Provider>
    )
}));