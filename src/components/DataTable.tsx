/**
 * 数据表
 * 由TableCore+特定service和传参构成
 */
import React from 'react'
import { ITableService } from '../services/ITableService';
import TableCore, { ITableCoreProps } from './TableCore';
const defaultToolbar = ['undo', 'redo', 'globalRange', 'autoHeight'];
export interface IDataTableProps extends ITableCoreProps {
}
export default function (props: IDataTableProps) {
    const { services, ...coreProps } = props;
    let sary: ITableService[] = [
    ];
    sary = sary.concat(services || []);
    return <TableCore items={defaultToolbar} {...coreProps} services={sary} />;
}