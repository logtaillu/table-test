import { AiOutlineVerticalAlignMiddle, AiOutlineVerticalAlignTop, AiOutlineVerticalAlignBottom } from "react-icons/ai";
import { ImParagraphLeft, ImParagraphCenter, ImParagraphRight } from "react-icons/im";
import { IToolbarItemObj } from "../interfaces/IToolbar";
// 横向
const getTextAlign = (curval: string, icon): IToolbarItemObj => {
    const key = "align" + curval[0].toUpperCase() + curval.slice(1);
    return {
        key: key,
        icon,
        active: ({ driver }) => driver.getValue("cell", ["cssvar", "--ev-ah"]) === curval,
        onClick: ({ driver }) => {
            driver.exec("styleChange", { "--ev-ah": curval });
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
    source: [
        { label: <AiOutlineVerticalAlignTop />, value: "top" },
        { label: <AiOutlineVerticalAlignMiddle />, value: "middle" },
        { label: <AiOutlineVerticalAlignBottom />, value: "bottom" }
    ],
    getValue: ({ driver }) => driver.getValue("cell", ["cssvar", "--ev-av"]),
    onClick: ({ driver, value }) => {
        driver.exec("styleChange", { "--ev-av": value });
    },
    btnlist: true
}