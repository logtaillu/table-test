import React from 'react';
import { useDrag } from 'react-dnd';
import { IDragItem } from '../interfaces/IGlobalType';
export interface IDragBoxProps extends IDragItem{
    /** 名称 */
    className?: string;
    /**样式 */
    style?: React.CSSProperties;
}
export default function (props: React.PropsWithChildren<IDragBoxProps>) {
    const { value, format, type = "tableCell" } = props;
    const [, drag] = useDrag(() => ({
        value, format, type
    }),[value, format, type]);
    return (
        <div ref={drag} className={props.className || ""} style={props.style}>
            {props.children}
        </div>
    )
}