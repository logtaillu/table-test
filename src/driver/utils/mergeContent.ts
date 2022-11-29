/** 配置初始化函数 */

import { IDriverContent } from "../../interfaces/IDriverContent";

function getDefaultContent(): IDriverContent {
    return ({
        all: {
            row: { autoHeight: true, rowHeight: 40 },
            // col: { colWidth: 100 },
            cell: {
                cssvar: {
                    "--ev-fsz": 12, // 因为scale计算，这里用number
                    "--ev-ff": "Microsoft YaHei",
                    "--ev-fc": "#666",
                    "--ev-ah": "center",
                    "--ev-av": "middle",
                    "--ev-bg": "transparent",
                    "--ev-fw": "normal",
                    "--ev-fsy": "normal",
                    "--ev-dr": "none",
                    "--ev-pl": "0px",
                    "--ev-pr": "0px",
                    "--ev-pt": "0px",
                    "--ev-pb": "0px",
                },
                borderType: "all",
                borderColor: "#377CFB",
                borderStyle: "solid",
                borderWidth: "1px"
            }
        },
        bodyRows: [],
        columns: [],
        headerRows: []
    })
};
/** 写入初始配置 */
export default function (content?: IDriverContent ) {
    const init = getDefaultContent();
    if (!content) {
        return init;
    }
    const mergeByTarget = (target, info) => {
        Object.keys(info).map(key => {
            const cur = target[key];
            const val = info[key];
            if (cur && typeof (cur) === "object" && !Array.isArray(cur)) {
                // 向内对比
                mergeByTarget(cur, val);
            } else if (!target[key]) {
                // 没有才覆盖，target的优先，写回target
                target[key] = val;
            }
        })
    }
    mergeByTarget(content, init);
    return content;
}