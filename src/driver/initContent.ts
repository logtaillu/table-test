/** 配置初始化函数 */
import { IDriverCache } from "../interfaces/IDriverCache";

export default (): IDriverCache => ({
    data:{},
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
    rowCount: 0,
    deep: 0,
    colCount: 0,
    externalCount: 0
})