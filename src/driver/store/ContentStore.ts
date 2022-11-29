/** content控制 */
import { makeAutoObservable, toJS } from "mobx";
import { IDriverContent } from "../../interfaces/IDriverContent";
import { ITableProps } from "../../interfaces/ITableProps";
import EvDriver from "../EvDriver";
import mergeContent from "../utils/mergeContent";

export default class ContentStore {
    driver: EvDriver;
    constructor(driver: EvDriver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
    /** 缓存内容 */
    content: IDriverContent = {};
    /** 刷新缓存 */
    refresh(content: ITableProps["content"]) {
        this.content = mergeContent(content);
        this.driver.action.execHook("onContentInit", toJS(this.content));
    }
}