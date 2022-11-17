import React from 'react'
import { observer } from "mobx-react-lite";
import { IRenderCol } from '../../interfaces/ITableProps';
import AutoHeightComponent from './AutoHeightComponent';
export interface IHeaderCell {
    data: IRenderCol;
    row: number;
    col: number;
}
export default observer((props: IHeaderCell) => {
    return (
        <AutoHeightComponent component="th" type="header" {...props}>
            占位
        </AutoHeightComponent>
    )
});