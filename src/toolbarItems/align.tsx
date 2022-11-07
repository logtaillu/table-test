import { AiOutlineVerticalAlignMiddle, AiOutlineVerticalAlignTop, AiOutlineVerticalAlignBottom } from "react-icons/ai";
import { ImParagraphLeft, ImParagraphCenter, ImParagraphRight } from "react-icons/im";
import { IToolbarItemObj } from "./IToolbarItem";
// 横向
const getTextAlign = (curval: string, icon): IToolbarItemObj => {
    const key = "align" + curval[0].toUpperCase() + curval.slice(1);
    return {
        key: key,
        icon,
        active: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-text-align"]) === curval,
        tooltip: key,
        onClick: ({ driver }) => {
            driver.exec("styleChange", { "--cell-text-align": curval });
        }
    }
}
export const alignLeft = getTextAlign("left", <ImParagraphLeft />);
export const alignRight = getTextAlign("right", <ImParagraphRight />);
export const alignCenter = getTextAlign("center", <ImParagraphCenter />);

// 纵向
export const verticalAlign: IToolbarItemObj = {
    key: "verticalAlign",
    icon: true,
    tooltip: "verticalAlign",
    source: [
        { label: <AiOutlineVerticalAlignTop />, value: "top" },
        { label: <AiOutlineVerticalAlignMiddle />, value: "middle" },
        { label: <AiOutlineVerticalAlignBottom />, value: "bottom" }
    ],
    getValue: ({ driver }) => driver.getRangeValue("cell", ["cssvars", "--cell-vertical-align"]),
    onClick: ({ driver, value }) => {
        driver.exec("styleChange", { "--cell-vertical-align": value });
    },
    btnlist: true
}