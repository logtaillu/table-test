/**
 * 数据表
 * 由TableCore+特定service和传参构成
 */
import React from 'react'
import { ITableService } from '../services/ITableService';
import resizeableGrid from '../services/resizeableGrid';
import TableCore, { ITableCoreProps } from './TableCore';
const defaultToolbar = ['undo', 'redo', 'globalRange', 'autoHeight', 'size'];
export interface IDataTableProps extends ITableCoreProps {
    resizeable?: boolean;
}
export default function (props: IDataTableProps) {
    const { services, resizeable = true, ...coreProps } = props;
    let sary: ITableService[] = [
    ];
    if (resizeable) {
        sary.push(resizeableGrid);
    }
    sary = sary.concat(services || []);
    return <TableCore items={defaultToolbar} {...coreProps} services={sary} />;
}