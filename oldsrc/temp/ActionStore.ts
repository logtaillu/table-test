/** 动作相关store */
import { makeAutoObservable } from "mobx";
import { IActionStack } from "../interfaces/IActionStack";
import EvDriver from "./EvDriver";

export default class ActionStore {
    driver: EvDriver;
    constructor(driver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }

    /** 操作栈 */
    actionStack: IActionStack = [];
    /** 回退栈 */
    undoStack: IActionStack = [];
}