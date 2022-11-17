import React from 'react'
import { observer } from "mobx-react-lite";
import AutoHeightComponent from './AutoHeightComponent';
export interface IBodyCell{
    data: any;
    row: number;
    col: number;
}
export default observer((props: IBodyCell) => {
    return (
        <AutoHeightComponent component="td" type="body" {...props}>
            占位
        </AutoHeightComponent>
    );
});