import React from 'react'
import { observer } from "mobx-react-lite";
import { IRenderCol } from '../../interfaces/ITableProps';
export interface IHeaderCell {
    data: IRenderCol;
}
export default observer((props: IHeaderCell) => {
    return <th>占位</th>
});