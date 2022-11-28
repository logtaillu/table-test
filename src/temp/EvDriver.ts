import ActionStore from "./ActionStore"
import ContentStore from "./ContentStore";
import PropStore from "./PropStore";

export default class EvDriver { 
    action: ActionStore;
    props: PropStore;
    content: ContentStore;
    constructor() {
        this.action = new ActionStore(this);
        this.props = new PropStore(this);
        this.content = new ContentStore(this);
    }
}