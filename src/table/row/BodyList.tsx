import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react'
import BodyCell from '../cell/BodyCell';
import { ITableRow } from './TableRow';
export default observer((props: ITableRow) => {
    return (
        <Fragment>
            {props.columns.map((col, index) => {
                const key = Array.isArray(col.dataIndex) ? col.dataIndex.join(".") : col.dataIndex || col.key || `body-${col.row}-${index}`;
                return <BodyCell data={props.data} key={key} row={props.row} col={index} />;
            }).filter(s => !!s)}
        </Fragment>
    )
});