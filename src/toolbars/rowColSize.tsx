// 行高列宽设置
import { IToolbarItemObj } from '../interfaces/IToolbar';
import { ImTextHeight } from "react-icons/im";
import { AiOutlineColumnHeight } from "react-icons/ai";
import { FormattedMessage } from "react-intl";
import InputNumber from "../components/InputNumber";
/**@description 高度自适应设置 */
export const autoHeight: IToolbarItemObj = {
    key: "autoHeight",
    icon: <ImTextHeight />,
    tooltip: "heightSetting",
    source: [
        { value: "auto", label: "autoHeight" },
        { value: "fixed", label: "fixHeight" },
    ],
    getValue: ({ driver }) => {
        return !!driver.getValue("row", ["autoHeight"]) ? "auto" : "fixed";
    },
    onClick: ({ value, driver }) => {
        driver.exec("sizeChange", { autoHeight: value === "auto" ? true : false });
    }
};
/**@description 行高列宽，使用使用范围设置 */
export const size: IToolbarItemObj = {
    key: "size",
    icon: <AiOutlineColumnHeight />,
    dropdown: ({ driver }) => {
        const changeHeight = value => {
            driver.exec("sizeChange", { rowHeight: value });
        }
        const rowHeight = driver.getValue("row", ["rowHeight"]);
        const changeWidth = value => {
            driver.exec("sizeChange", { colWidth: value });
        }
        const colWidth = driver.getValue("col", ["colWidth"]);
        return (
            <div className="p-3">
                <label className="tool-input-group p-2">
                    <span><FormattedMessage id="rowHeight" /></span>
                    <InputNumber callback={changeHeight} value={rowHeight} />
                </label>
                <label className="tool-input-group p-2">
                    <span><FormattedMessage id="colWidth" /></span>
                    <InputNumber callback={changeWidth} value={colWidth} />
                </label>
            </div>
        )
    }
}