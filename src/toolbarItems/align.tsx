import { AiOutlineVerticalAlignMiddle, AiOutlineVerticalAlignTop, AiOutlineVerticalAlignBottom } from "react-icons/ai";
import { ImParagraphLeft, ImParagraphCenter, ImParagraphRight } from "react-icons/im";
import { MdOutlinePadding } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import SuffixInput from "../components/SuffixInput";
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
// 内边距
export const padding: IToolbarItemObj = {
    key: "padding",
    mode:"dropdown",
    icon: <MdOutlinePadding />,
    source: {
        // 后缀集合
        suffixs: ["px", "%"],
        // 无后缀的展示
        nosuffix: "px"
    },
    dropdown: ({ driver, source }) => {
        const childs = ["top", "bottom", "left", "right"].map(key => {
            const code = key[0];
            const path = `--ev-p${code}` as any;
            const value = driver.getValue("cell", ["cssvar", path]);
            const change = val => {
                driver.exec("styleChange", { [path]: val });
            }
            return (
                <label key={key} className="tool-input-group p-2">
                    <span><FormattedMessage id={key} /></span>
                    <SuffixInput  {...source} callback={change} value={value} />
                </label>
            )
        })
        return (
            <div className="p-3">
                {childs}
            </div>
        );
    }
}