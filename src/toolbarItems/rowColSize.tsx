// 行高列宽设置
import { IToolbarItemObj } from "./IToolbarItem";
import { ImTextHeight } from "react-icons/im";
/**@description 高度自适应设置 */
export const autoHeight: IToolbarItemObj = {
    key: "autoHeight",
    icon: <ImTextHeight />,
    tooltip: "heightSetting",
    source: [
        { value: "auto", label: "autoHeight" },
        { value: "fixed", label: "fixHeight" },
    ],
    listmode: ({ driver }) => driver.getRangeValue("row", "autoHeight", true),
    onClick: ({ value, driver }) => {
        driver.setRangeValue("row", "autoHeight", value === "auto" ? true : false, true);
    }
};