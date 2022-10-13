import React from 'react'
export interface IBtn {
    text: string;
}
export default function (props:IBtn) {
    return <button>{props.text}</button>;
}