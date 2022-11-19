import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react'
import HeaderCell from '../cell/HeaderCell';
import { ITableRow } from './TableRow';
export default observer((props: ITableRow) => {
    return (
        <Fragment>
            {props.columns.map((col, index) => {
                const key = Array.isArray(col.dataIndex) ? col.dataIndex.join(".") : col.dataIndex || col.key || `header-${col.row}-${index}`;
                return <HeaderCell data={col} key={key}/>;
            }).filter(s => !!s)}
        </Fragment>
    )
});