/**
 * 类excel表
 * 由TableCore+特定service和传参构成
 */
import React from 'react'
import enrichTableData from '../services/enrichTableData';
import excelSider from '../services/excelSider';
import { ITableService } from '../services/ITableService';
import rangeSelect from '../services/rangeSelect';
import resizeableGrid from '../services/resizeableGrid';
import TableCore, { ITableCoreProps } from './TableCore'
const defaultToolbar = ['undo', 'redo', 'autoHeight', 'size'];
export interface IExcelTableProps extends ITableCoreProps {
    /**@description 编辑模式，是否可伸缩 */
    resizeable?: boolean;
    /**@description 是否显示行列头 */
    sider?: boolean;
}
export default function (props: IExcelTableProps) {
    const { services, resizeable = true, sider = true, ...coreProps } = props;
    let sary: ITableService[] = [
        enrichTableData,
        rangeSelect
    ];
    if (sider) {
        sary.push(excelSider);
    }
    if (resizeable) {
        sary.push(resizeableGrid);
    }
    sary = sary.concat(services || []);
    return <TableCore
        items={defaultToolbar}
        {...coreProps}
        services={sary}
    />;
}