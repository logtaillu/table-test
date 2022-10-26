// 行高列宽设置
import { IToolbarItemObj } from "./IToolbarItem";
import { ImTextHeight } from "react-icons/im";
import { AiOutlineColumnHeight } from "react-icons/ai";
import { FormattedMessage } from "react-intl";
import { ChangeEventHandler } from "react";
/**@description 高度自适应设置 */
export const autoHeight: IToolbarItemObj = {
    key: "autoHeight",
    icon: <ImTextHeight />,
    tooltip: "heightSetting",
    source: [
        { value: "auto", label: "autoHeight" },
        { value: "fixed", label: "fixHeight" },
    ],
    listmode: ({ driver }) => {
        console.log(driver.getRangeValue("row", "autoHeight", []));
        return !!driver.getRangeValue("row", "autoHeight", []) ? "auto" : "fixed";
    },
    onClick: ({ value, driver }) => {
        driver.setRangeValue("row", "autoHeight", value === "auto" ? true : false, []);
    }
};
/**@description 行高列宽 */
export const size: IToolbarItemObj = {
    key: "size",
    icon: <AiOutlineColumnHeight />,
    tooltip: "size",
    dropdown: ({ driver }) => {
        const changeHeight: ChangeEventHandler<HTMLInputElement> = (e) => {
            driver.setRangeValue("row", "rowHeight", e.target.value);
        }
        const changeWidth: ChangeEventHandler<HTMLInputElement> = (e) => {
            driver.setRangeValue("col", "colWidth", e.target.value);
        } 
        return (
            <div className="p-3">
                <label className="input-group">
                    <span><FormattedMessage id="rowHeight" /></span>
                    <input type="number" className="input input-bordered" onChange={changeHeight}/>
                </label>
                <label className="input-group">
                    <span><FormattedMessage id="colWidth" /></span>
                    <input type="number" className="input input-bordered" onChange={changeWidth}/>
                </label>
            </div>
        )
    }
}