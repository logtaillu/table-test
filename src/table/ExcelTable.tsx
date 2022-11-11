import React from 'react'
import { IEvPlugin } from "../interfaces/IPlugin";
import { ITableProps } from "../interfaces/ITableProps";
import TableCore from "./TableCore";

const defaultToolbar = [
    ['undo', 'redo', 'autoHeight'],
    ['size', 'fontSize', 'fontFamily', 'fontColor', 'bold', 'italic', 'underline', 'backgroundColor'],
    ['alignLeft', 'alignCenter', 'alignRight', 'verticalAlign'],
    ['borderType', 'borderColor', 'borderStyle', 'borderWidth']
];
export interface IExcelTableProps extends ITableProps {
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