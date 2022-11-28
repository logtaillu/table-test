/** 动作相关store */
import { makeAutoObservable } from "mobx";
import EvDriver from "./EvDriver";

export default class ActionStore {
    driver: EvDriver;
    constructor(driver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
}