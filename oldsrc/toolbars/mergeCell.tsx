import React from 'react'
import { AiOutlineMergeCells, AiOutlineSplitCells } from 'react-icons/ai';
import { IToolbarItemObj } from '../interfaces/IToolbar';
/**@description 重做 */
export const mergeCell: IToolbarItemObj = {
    key: "mergeCell",
    icon: ({ driver }) => {
        return driver.isMerged ? <AiOutlineSplitCells /> : <AiOutlineMergeCells />;
    },
    tooltip: ({ driver, intl }) => {
        const key = driver.isMerged ? "splitCell" : "mergeCell";
        return intl.formatMessage({
            id: key, defaultMessage: key
        });
    },
    disabled: ({ driver }) => {
        return !(driver.content.selected && driver.content.selected.length > 0);
    },
    onClick: ({ driver }) => {
        driver.exec("mergeCell");
    }
}