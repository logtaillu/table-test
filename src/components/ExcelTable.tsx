/**
 * 类excel表
 * 由TableCore+特定service和传参构成
 */
import React from 'react'
import enrichData from '../services/enrichData';
import enrichKey from '../services/enrichKey';
import excelSider from '../services/excelSider';
import { ITableService } from '../services/ITableService';
import rangeSelect from '../services/rangeSelect';
import redoundo from '../services/redoundo';
import resizeableGrid from '../services/resizeableGrid';
import styleSetter from '../services/styleSetter';
import TableCore, { ITableCoreProps } from './TableCore'
const defaultToolbar = ['undo', 'redo', 'autoHeight', 'size', 'fontSize', 'fontFamily', 'fontColor', 'bold', 'italic', 'underline', 'backgroundColor', 'alignLeft', 'alignCenter', 'alignRight', 'verticalAlign', 'borderType', 'borderColor', 'borderStyle', 'borderWidth'];
export interface IExcelTableProps extends ITableCoreProps {
}
export default function (props: IExcelTableProps) {
    const { services, ...coreProps } = props;
    let sary: ITableService[] = [
        enrichData,
        // excelSider,
        resizeableGrid,
        redoundo,
        styleSetter,
        rangeSelect
    ];
    sary = sary.concat(services || []);
    sary.push(enrichKey);
    return <TableCore
        tableLayout='fixed'
        items={defaultToolbar}
        {...coreProps}
        services={sary}
        showHeader={false}
    />;
}