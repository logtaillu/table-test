// 工具栏组件表，目前不做observe控制
import { globalRange } from "./globalRange";
import { IToolbarItem, IToolbarItemObj } from "./IToolbarItem";
import { redo, undo } from "./redoundo";

class ToolbarItemControler {
    private itemMap: Record<string, IToolbarItemObj> = {
        redo, undo, globalRange
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
const ToolbarItem = new ToolbarItemControler();
export default ToolbarItem;