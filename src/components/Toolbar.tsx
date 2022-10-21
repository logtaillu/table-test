/**
 * 工具栏
 */
import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite';
import TableDriver from '../tableDriver/TableDriver';
import { IToolbarItem, IToolbarItemObj } from '../toolbarItems/IToolbarItem';
import ToolbarItem from '../toolbarItems/ToolbarItem';
import classnames from "classnames";
import { useIntl } from 'react-intl';
export interface IToolBarItem {
    /**@description 控制器 */
    driver: TableDriver;
    /**@description 工具栏配置 */
    target: IToolbarItemObj;
    /**@description 自定义资源表 */
    sources?: Record<string, any>;
}
/**@description 工具栏单项 */
const ReactToolbarItem = observer(function (props: IToolBarItem) {
    const { target, driver, sources } = props;
    const [open, setOpen] = useState(false);
    const ref = useRef<any>(null);
    const close = () => {
        (document.activeElement as any)?.blur();
        setOpen(false);
    }
    const intl = useIntl();
    const source = sources && sources[target.key] || target.source;
    const args = { driver, source, intl, close };
    // 需要dropdown时，打开下拉框，否则直接执行onClick
    const click = () => {
        if (target.dropdown || target.listmode) {
            if (open) {
                close();
            } else {
                setOpen(true);
                if (ref.current && ref.current.focus) {
                    ref.current.focus();
                }
            }
        } else if (target.onClick) {
            target.onClick(args);
        }
    };
    // 按钮
    const disabled = target.disabled ? target.disabled(args) : false;
    const active = target.active ? target.active(args) : false;
    const cls = classnames({
        "btn": true,
        "btn-square": true,
        "btn-disabled": disabled,
        "btn-active": active || open,
        "rounded-sm": true,
        "btn-sm": true,
        "w-auto": true,
        "min-w-sm": true,
        "text-opacity-80": disabled,
        "text-normal": true
    });
    const getValue = (func: any) => {
        if (typeof (func) === "function") {
            return func(args);
        } else {
            return typeof (func) === "string" ? intl.formatMessage({ id: func }) : func;
        }
    }
    const btn = (
        <div className={open ? "" : "tooltip tooltip-bottom"} data-tip={getValue(target.tooltip)} key={target.key} tabIndex={0}>
            <button className={cls} onClick={click} data-theme="toolbar">
                {getValue(target.icon)}
            </button>
        </div>
    );
    const dpbasecls = " whitespace-nowrap dropdown-content shadow rounded translate-x-[-50%] left-[50%] bg-white";
    // 下拉
    if (target.listmode) {
        return (
            <div className='dropdown' key={target.key}>
                {btn}
                <ul ref={ref} onBlur={close} tabIndex={0} className={"menu" + dpbasecls}>
                    {(source || []).map(({ value, label }: { value: any, label: string }) => {
                        const click = () => {
                            if (target.onClick) {
                                target.onClick({ ...args, value });
                            }
                            close();
                        }
                        return (
                            <li key={value} value={value} onClick={click}>
                                <a className={classnames({ "py-4px": true, active: target.listmode ? target.listmode(args) === value : false })}>{intl.formatMessage({ id: label, defaultMessage: label })}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    } else if (target.dropdown) {
        return (
            <div className={"dropdown"} key={target.key}>
                {btn}
                <div ref={ref} onBlur={close} tabIndex={0} className={"card card-compact w-auto p-0 text-secondary-content" + dpbasecls}>
                    {target.dropdown(args)}
                </div>
            </div>
        )
    } else {
        return btn;
    }
});

export interface IActionToolbarProps {
    /**@description 控制器 */
    driver: TableDriver;
    /**@description 自定义工具栏 */
    items?: IToolbarItem[];
    /**@description 自定义资源表 */
    sources?: Record<string, any>;
    /**@description 是否有工具栏 */
    toolbar?: boolean;
}
/**@description 工具栏 */
export default observer(function (props: IActionToolbarProps) {
    const { toolbar, driver, items, sources } = props;
    if (!toolbar) {
        return null;
    }
    const list = (items || []).map((item, idx) => {
        const target = ToolbarItem.item(item);
        if (!target) {
            return <div key={idx} />;
        } else {
            return <ReactToolbarItem key={target.key} driver={driver} target={target} sources={sources} />;
        }
    });
    return (
        <div className={driver.prefix("toolbar") + " flex"}>
            {list}
        </div>
    )
});