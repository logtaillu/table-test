import React, { useEffect, useImperativeHandle, useState } from 'react';
import { observer } from "mobx-react-lite";
import TableDriver from '../tableDriver';
import { prefix } from '../utils/basicUtil';
import InnerTable from './InnerTable';
import SelectRange from './SelectRange';
import ActionToolbar from './ActionToolbar';
import { ITableCacheConfig } from '../tableDriver/ITableDriver';
import { ITableService } from '../services/ITableService';
import { TableProps } from 'rc-table/lib/Table';
import "../styles/index.less";
export interface ITableCoreProps extends TableProps<any>{
    /**@description 自定义配置 */
    config?: ITableCacheConfig;
    /**@description 启用的功能 */
    services?: ITableService[];
    /**@description 是否显示toolbar */
    toolbar?: boolean;
}
export default observer(React.forwardRef(function (props: ITableCoreProps, ref) {
    const { config, services, toolbar, ...tableProps } = props;
    const [driver] = useState(() => new TableDriver(config || {}));
    // config对象change，重置
    useEffect(() => {
        driver.reset(config || {});
    }, [config]);
    useEffect(() => {
        (services || []).map(s => driver.registerActions(s.actions));
    }, [services]);
    // ref函数
    useImperativeHandle(ref, () => ({

    }));
    return (
        <div className={prefix("table-wrapper", tableProps.prefixCls)}>
            <ActionToolbar driver={driver} toolbar={toolbar} />
            <InnerTable driver={driver} table={tableProps} services={services} />
            <SelectRange driver={driver} />
        </div>
    )
}));