import React from 'react'
import colDataService from '../services/colDataService';
import { ITableService } from '../services/ITableService';
import TableCore, { ITableCoreProps } from './TableCore'
export interface IExcelTableProps extends ITableCoreProps{
}
export default function (props: IExcelTableProps) {
    const { services, ...coreProps } = props;
    let sary: ITableService[] = [
        colDataService
    ];
    sary = sary.concat(services || []);
    return <TableCore
        showHeader={false}
        {...coreProps}
        services={sary}
    />;
}