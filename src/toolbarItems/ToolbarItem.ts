// 工具栏组件表，目前不做observe控制
import { IToolbarItem, IToolbarItemObj } from "./IToolbarItem";
import { redo, undo } from "./redoundo";

class ToolbarItemControler {
    private itemMap: Record<string, IToolbarItemObj> = {
        redo, undo
    };
    private defaultItems: IToolbarItem[] = ["undo", "redo"];
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
    // 修改默认列表
    setDefault(list: IToolbarItem[]) {
        this.defaultItems = list;
    }
    // 获取默认列表
    get defaultList() {
        return this.defaultItems || [];
    }

};
const ToolbarItem = new ToolbarItemControler();
export default ToolbarItem;