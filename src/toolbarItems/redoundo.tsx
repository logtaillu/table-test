import React from 'react'
import { IToolbarItemObj } from "./IToolbarItem";
import { ImUndo2,ImRedo2 } from "react-icons/im";
export const undo: IToolbarItemObj = {
    key: "undo",
    icon: () => <ImUndo2 />,
    tooltip: ({intl}) => intl.formatMessage({ id: "undo" }),
    disabled: ({driver}) => {
        return !driver.undoEnable;
    },
    onClick: ({ driver }) => {
        driver.undoAction();
    }
}
export const redo: IToolbarItemObj = {
    key: "redo",
    icon: () => <ImRedo2 />,
    tooltip: ({ intl }) => intl.formatMessage({ id: "redo" }),
    disabled: ({driver}) => {
        return !driver.redoEnable;
    },
    onClick: ({ driver }) => {
        driver.redoAction();
    }
}