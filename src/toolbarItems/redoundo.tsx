import React from 'react'
import { IToolbarItemObj } from "./IToolbarItem";
import { ImUndo2, ImRedo2 } from "react-icons/im";
/**@description 撤销 */
export const undo: IToolbarItemObj = {
    key: "undo",
    icon: <ImUndo2 />,
    tooltip: "undo",
    disabled: ({driver}) => {
        return !driver.undoEnable;
    },
    onClick: ({ driver }) => {
        driver.undoAction();
    }
}
/**@description 重做 */
export const redo: IToolbarItemObj = {
    key: "redo",
    icon: <ImRedo2 />,
    tooltip: "redo",
    disabled: ({driver}) => {
        return !driver.redoEnable;
    },
    onClick: ({ driver }) => {
        driver.redoAction();
    }
}