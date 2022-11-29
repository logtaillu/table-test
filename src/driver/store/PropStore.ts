import { makeAutoObservable } from "mobx";
import React from "react";
import { ITableProps } from "../../interfaces/ITableProps";
import { defaultLang, languages } from "../../locales";
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
    locales: any = {};
    className: string = "";
    style: React.CSSProperties = {};
    // 更新
    update(props: Partial<ITableProps>) {
        Object.keys(props).map(key => {
            const val = props[key];
            if (this[key] !== val && !isEmpty(val)) {
                this[key] = val;
            }
        });
    }
    // 样式添加前缀
    prefix(cls: string) {
        return cls.length ? cls.split(" ").filter(s => !!s).map(s => this.prefixCls + "-" + s).join(" ") : this.prefixCls;
    }

    getMessages = () => {
        const lang = this.lang || defaultLang;
        let innerLang = languages[lang];
        let userLang = this.locales &&  this.locales[lang];
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
}