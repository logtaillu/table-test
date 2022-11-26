import React from 'react'
import { IEvPlugin } from "../interfaces/IPlugin";
import { ITableCoreProps } from "../interfaces/ITableProps";
import TableCore from "./TableCore";

const defaultToolbar = [
    ['undo', 'redo', 'autoHeight', 'mergeCell'],
    ['size', 'fontSize', 'fontFamily', 'fontColor', 'bold', 'italic', 'underline', 'backgroundColor'],
    ['alignLeft', 'alignCenter', 'alignRight', 'verticalAlign'],
    ['borderType', 'borderColor', 'borderStyle', 'borderWidth']
];
export interface IExcelTableProps extends ITableCoreProps {
}

export default function (props: IExcelTableProps) {
    const { plugins, ...coreProps } = props;
    let sary: IEvPlugin[] = [];
    sary = sary.concat(plugins || []);
    return <TableCore
        items={defaultToolbar}
        {...coreProps}
        plugins={sary}
    />;
}