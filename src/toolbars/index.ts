// 工具栏组件表，目前不做observe控制
import * as fonts from "./font";
import * as aligns from "./align";
import { globalRange } from "./globalRange";
import { IToolbarItem, IToolbarItemObj } from "../interfaces/IToolbar";
import { redo, undo } from "./redoundo";
import { autoHeight, size } from "./rowColSize";
import * as borders from "./border";
import { mergeCell } from "./mergeCell";

class ToolbarItemControler {
    private itemMap: Record<string, IToolbarItemObj> = {
        redo, undo, globalRange, autoHeight, size, ...fonts, ...aligns, ...borders, mergeCell
    };
    // 注册
    register(items: IToolbarItemObj[]) {
        items.map(item => {
            this.itemMap[item.key] = item;
        });
    }
    // 获取对象
    item(target: IToolbarItem) {
        return typeof (target) === "string" ? this.itemMap[target] : target;
    }

};
const toolbars = new ToolbarItemControler();
export default toolbars;