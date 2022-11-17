import React from 'react'
import { observer } from "mobx-react-lite";
export interface IBodyCell{
    data: any;
}
export default observer((props: IBodyCell) => {
    return <td>占位</td>
});