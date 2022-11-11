import React from 'react'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import BlurInput, { IBlurInput } from './BlurInput'
/**@description 数字输入框 */
export interface IInputNumber extends IBlurInput {

}
export default function (props: IInputNumber) {
    const { callback, ...others } = props;
    const back = val => {
        callback(Number(val));
    }
    return (
        <div className='tool-input-number'>
            <BlurInput
                type="number"
                autoComplete="off"
                callback={back}
                {...others}
            />
            <div className="absolute">
                <button><AiFillCaretUp /></button>
                <button><AiFillCaretDown /></button>
            </div>
        </div>
    )
}