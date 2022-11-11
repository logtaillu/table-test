import React from 'react'
import { IToolbarItemObj } from '../interfaces/IToolbar';
import { ImUndo2, ImRedo2 } from "react-icons/im";
/**@description 撤销 */
export const undo: IToolbarItemObj = {
    key: "undo",
    icon: <ImUndo2 />,
    disabled: ({driver}) => {
        return !driver.undoEnable;
    },
    onClick: ({ driver }) => {
        driver.undo();
    }
}
/**@description 重做 */
export const redo: IToolbarItemObj = {
    key: "redo",
    icon: <ImRedo2 />,
    disabled: ({driver}) => {
        return !driver.redoEnable;
    },
    onClick: ({ driver }) => {
        driver.redo();
    }
}