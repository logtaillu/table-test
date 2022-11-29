import SetMap from "../components/SetMap";
import { IDriverContent } from "../interfaces/IDriverContent";
import { IDriverHook, IDriverHookType } from "../interfaces/ITableProps";
import ActionStore from "./store/ActionStore";
import ContentStore from "./store/ContentStore";
import PropStore from "./store/PropStore";

/** 状态控制器 */
export default class EvDriver { 
    content: ContentStore;
    action: ActionStore;
    props: PropStore;
    constructor() {
        this.content = new ContentStore(this);
        this.action = new ActionStore(this);
        this.props = new PropStore(this);
    }
}