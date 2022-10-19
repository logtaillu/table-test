/**
 * 类excel表
 * 由TableCore+特定service和传参构成
 */
import React from 'react'
import colDataService from '../services/colDataService';
import { ITableService } from '../services/ITableService';
import rangeSelectService from '../services/rangeSelectService';
import TableCore, { ITableCoreProps } from './TableCore'
const defaultToolbar = ['undo', 'redo'];
export interface IExcelTableProps extends ITableCoreProps {
}
export default function (props: IExcelTableProps) {
    const { services, ...coreProps } = props;
    let sary: ITableService[] = [
        colDataService,
        rangeSelectService
    ];
    sary = sary.concat(services || []);
    return <TableCore
        items={defaultToolbar}
        showHeader={false}
        {...coreProps}
        services={sary}
    />;
}