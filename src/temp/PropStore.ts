/** 表格传参相关store */
import { makeAutoObservable } from "mobx";
import EvDriver from "./EvDriver";

export default class PropStore {
    driver: EvDriver;
    constructor(driver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
}