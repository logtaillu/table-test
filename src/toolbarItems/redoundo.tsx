import React from 'react'
import { IToolbarItemObj } from "./IToolbarItem";
import { FaRedo,FaUndo } from "react-icons/fa";
export const undo: IToolbarItemObj = {
    key: "undo",
    icon: () => <FaUndo />,
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
    icon: () => <FaRedo />,
    tooltip: ({ intl }) => intl.formatMessage({ id: "redo" }),
    disabled: ({driver}) => {
        return !driver.redoEnable;
    },
    onClick: ({ driver }) => {
        driver.redoAction();
    }
}