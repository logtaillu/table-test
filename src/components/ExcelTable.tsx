/**
 * 类excel表
 * 由TableCore+特定service和传参构成
 */
import React from 'react'
import enrichData from '../services/enrichData';
import enrichKey from '../services/enrichKey';
import excelSider from '../services/excelSider';
import { ITableService } from '../services/ITableService';
import redoundo from '../services/redoundo';
import resizeableGrid from '../services/resizeableGrid';
import styleSetter from '../services/styleSetter';
import TableCore, { ITableCoreProps } from './TableCore'
const defaultToolbar = ['undo', 'redo', 'autoHeight', 'size', 'fontSize', 'fontFamily', 'fontColor', 'alignLeft', 'alignCenter', 'alignRight', 'verticalAlign'];
export interface IExcelTableProps extends ITableCoreProps {
}
export default function (props: IExcelTableProps) {
    const { services, ...coreProps } = props;
    let sary: ITableService[] = [
        enrichData,
        excelSider,
        resizeableGrid,
        redoundo,
        styleSetter
    ];
    sary = sary.concat(services || []);
    sary.push(enrichKey);
    return <TableCore
        items={defaultToolbar}
        {...coreProps}
        services={sary}
    />;
}