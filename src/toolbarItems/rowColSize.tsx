// 行高列宽设置
import { IToolbarItemObj } from "./IToolbarItem";
import { ImTextHeight } from "react-icons/im";
export const autoHeight: IToolbarItemObj = {
    key: "autoHeight",
    icon: <ImTextHeight />,
    tooltip: "heightSetting",
    // source: [
    //     {value:""}
    // ]
    // listmode: ({driver})=>driver.config.au,
    // source: keys.map(k => ({ value: k, label: k })),
    // onClick: ({ value, driver }) => {
    //     driver.setConf({ globalRange: value });
    // }
};