import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite';
import TableDriver from '../tableDriver/TableDriver';
import { IToolbarItemObj } from '../toolbarItems/IToolbarItem';
import classnames from "classnames";
import { useIntl } from 'react-intl';
import DropDown from "rc-dropdown";
export interface IToolBarItem {
    /**@description 控制器 */
    driver: TableDriver;
    /**@description 工具栏配置 */
    target: IToolbarItemObj;
    /**@description 自定义资源表 */
    sources?: Record<string, any>;
}
/**@description 工具栏单项 */
export default observer(function (props: IToolBarItem) {
    let { target, driver, sources } = props;
    const [open, setOpen] = useState(false);
    const [temp, setTemp] = useState(null);
    const intl = useIntl();
    // 合并
    if (sources && sources[target.key]) {
        if (Array.isArray(sources[target.key])) {
            target = { ...target, source: sources[target.key] };
        } else {
            target = { ...target, ...sources[target.key] };
        }
    }
    const mode = target.dropdown ? "dropdown" : target.getValue ? "list" : "btn";
    const args = { driver, source: target.source, intl, setValue: setTemp, value: temp };
    // 关闭
    const clickAndClose = (userArgs = {}) => {
        if (target.onClick) {
            target.onClick({ ...args, ...userArgs });
        }
        if (mode !== "btn") {
            setOpen(false);
        }
    }
    // visible 改变
    const visibleChange = (visible: boolean) => {
        if (visible) {
            setOpen(true);
        } else {
            clickAndClose();
        }
    }
    // 按钮
    const disabled = target.disabled ? target.disabled(args) : false;
    const active = target.active ? target.active(args) : false;
    const cls = classnames({
        "btn-disabled": disabled,
        "btn-active": active || open,
        "text-opacity-80": disabled,
        "toolbar-btn": true
    });
    // 文本
    const getValue = (func: any, str = false) => {
        if (typeof (func) === "function") {
            return func(args);
        } else {
            if (func === true && target.getValue) {
                func = target.getValue(args);
                // 列表模式，找label值
                if (mode === "list") {
                    const activeItem = (target.source || []).find(s => s.value === func);
                    if (activeItem) {
                        func = activeItem.label;
                    }
                }
            }
            if (typeof (func) === "string") {
                const val = intl.formatMessage({ id: func });
                return str ? val : <span className="px-2">{val}</span>;
            } else {
                return func;
            }
        }
    }
    const btn = (
        <div className="dptooltip" data-tip={getValue(target.tooltip, true)} key={target.key} tabIndex={0}>
            <button className={cls} onClick={mode === "btn" ? clickAndClose : undefined}>
                {getValue(target.icon)}
            </button>
        </div>
    );

    const dp = (overlay: React.ReactElement) => (
        <DropDown visible={open} key={target.key} overlay={overlay} onVisibleChange={visibleChange} trigger="click" placement="bottomCenter">
            {btn}
        </DropDown>
    );
    // 下拉模式(dropdown)
    if (target.dropdown) {
        const value = open && temp ? temp : target.getValue ? target.getValue(args) : null;
        return dp((
            <div className='card bg-white shadow-xl rounded-md'>
                {target.dropdown({ ...args, value })}
            </div>
        ));
    } else if (target.getValue) {
        // 下拉列表
        const overlay = (
            <ul className='toolbar-menu'>
                {(target.source || []).map(({ value, label }: { value: any, label: string }) => {
                    const click = () => {
                        clickAndClose({ value });
                    }
                    return (
                        <li key={value} value={value} onClick={click}>
                            <a className={classnames({ "py-4px": true, active: target.getValue ? target.getValue(args) === value : false })}>{intl.formatMessage({ id: label, defaultMessage: label })}</a>
                        </li>
                    )
                })}
            </ul>
        );
        return dp(overlay);
    } else {
        return btn;
    }
});
