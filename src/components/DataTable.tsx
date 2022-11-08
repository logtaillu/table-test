/**
 * 数据表
 * 由TableCore+特定service和传参构成
 */
import React from 'react'
import enrichKey from '../services/enrichKey';
import { ITableService } from '../services/ITableService';
import redoundo from '../services/redoundo';
import resizeableGrid from '../services/resizeableGrid';
import styleSetter from '../services/styleSetter';
import TableCore, { ITableCoreProps } from './TableCore';
const defaultToolbar = ['undo', 'redo', 'globalRange', 'autoHeight', 'size', 'fontSize', 'fontFamily', 'fontColor', 'bold','italic','underline', 'backgroundColor', 'alignLeft', 'alignCenter', 'alignRight', 'verticalAlign'];
export interface IDataTableProps extends ITableCoreProps {
}
export default function (props: IDataTableProps) {
    const { services, ...coreProps } = props;
    let sary: ITableService[] = [
        resizeableGrid,
        redoundo,
        styleSetter
    ];
    sary = sary.concat(services || []);
    sary.push(enrichKey);
    return <TableCore items={defaultToolbar} {...coreProps} services={sary} />;
}