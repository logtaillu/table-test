import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import TableDriver from '../tableDriver';
import { ITableCacheConfig } from '../tableDriver/ITableDriver';
import Table from 'rc-table';
import { TableProps } from 'rc-table/lib/Table';
export interface ITableCoreProps extends TableProps<any> {
    config?: ITableCacheConfig;
}
export default observer(function (props: ITableCoreProps) {
    const { config, ...tableProps } = props;
    const [driver] = useState(() => new TableDriver(config || {}));
    return (
        <Table />
    )
});