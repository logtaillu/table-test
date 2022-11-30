/** 向内传递的props入参 */
import { makeAutoObservable } from "mobx";
import React from "react";
import { IEditable, ITableProps } from "../../interfaces/ITableProps";
import { IToolbarItem } from "../../interfaces/IToolbar";
import { defaultLang, languages } from "../../locales";
import toolbarItems from "../../toolbarItems";
import EvDriver from "../EvDriver";
import { isEmpty } from "../utils/valueUtil";

export default class PropStore {
    driver: EvDriver;
    constructor(driver: EvDriver) {
        this.driver = driver;
        makeAutoObservable(this, { driver: false });
    }
    lang: string = navigator.language;
    prefixCls: string = "ev";
    locales: ITableProps["locales"] = {};
    className: string = "";
    style: ITableProps["style"] = {};
    editable: ITableProps["editable"] = false;
    items: ITableProps["items"] = [];
    sources: ITableProps["sources"] = {};
    /** 更新 */
    update(props: Partial<ITableProps>) {
        Object.keys(props).map(key => {
            const val = props[key];
            if (this[key] !== val && !isEmpty(val)) {
                this[key] = val;
            }
        });
    }
    /** 样式添加前缀 */
    prefix(cls: string) {
        return cls.length ? cls.split(" ").filter(s => !!s).map(s => this.prefixCls + "-" + s).join(" ") : this.prefixCls;
    }
    /** 合并语言配置 */
    getMessages = () => {
        const lang = this.lang || defaultLang;
        let innerLang = languages[lang];
        let userLang = this.locales && this.locales[lang];
        if (innerLang && userLang) {
            return { ...innerLang, ...userLang };
        } else if (innerLang | userLang) {
            return innerLang || userLang;
        } else {
            innerLang = languages[defaultLang];
            let userLang = this.locales && this.locales[defaultLang];
            return userLang ? { ...innerLang, ...userLang } : innerLang;
        }
    }
    /** 获取各种可编辑类型 */
    getEditableKey(key: keyof IEditable) {
        if (this.editable) {
            if (typeof (this.editable) === "boolean") {
                return this.editable;
            } else {
                return this.editable[key] || false;
            }
        } else {
            return false;
        }
    }
    get toolbar() { return this.getEditableKey("toolbar") };
    get colResizeable() { return this.getEditableKey("colResizeable") };
    get rowResizeable() { return this.getEditableKey("rowResizeable") };
    get cellEditable() { return this.getEditableKey("cellEditable") };
    /** 获取工具栏单项配置 */
    getToolbarItem(target: IToolbarItem) {
        let item = toolbarItems.item(target);
        const targetSource = this.sources && this.sources[item.key];
        if (Array.isArray(targetSource)) {
            item = { ...item, source: targetSource };
        } else {
            item = { ...item, ...targetSource };
        }
        return item;
    }
}