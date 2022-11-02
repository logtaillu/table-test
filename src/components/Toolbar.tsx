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
import DropDown from "rc-dropdown";
import { useDriver } from './DriverContext';
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
    let { target, driver, sources } = props;
    const [open, setOpen] = useState(false);
    const ref = useRef<any>(null);
    const close = () => {
        setOpen(false);
    }
    const intl = useIntl();
    if (sources && sources[target.key]) {
        if (Array.isArray(sources[target.key])) {
            target = { ...target, source: sources[target.key] };
        } else {
            target = { ...target, ...sources[target.key] };
        }
    }
    const args = { driver, source: target.source, intl, close };
    // 需要dropdown时，打开下拉框，否则直接执行onClick
    const click = () => {
        if (target.onClick) {
            target.onClick(args);
        }
    };
    // 按钮
    const disabled = target.disabled ? target.disabled(args) : false;
    const active = target.active ? target.active(args) : false;
    const cls = classnames({
        "btn-disabled": disabled,
        "btn-active": active || open,
        "text-opacity-80": disabled,
        "toolbar-btn": true
    });
    const getValue = (func: any) => {
        if (typeof (func) === "function") {
            return func(args);
        } else {
            return typeof (func) === "string" ? intl.formatMessage({ id: func }) : func;
        }
    }
    const btn = (
        <div className="dptooltip" data-tip={getValue(target.tooltip)} key={target.key} tabIndex={0}>
            <button className={cls} onClick={target.dropdown || target.listmode ? undefined : click}>
                {getValue(target.icon)}
            </button>
        </div>
    );

    const dp = (overlay: React.ReactElement) => (
        <DropDown visible={open} key={target.key} overlay={overlay} onVisibleChange={setOpen} trigger="click" placement="bottomCenter">
            {btn}
        </DropDown>
    );
    // 下拉
    if (target.listmode) {
        const overlay = (
            <ul className='toolbar-menu'>
                 {(target.source || []).map(({ value, label }: { value: any, label: string }) => {
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
        );
        return dp(overlay);
    } else if (target.dropdown) {
        return dp((
            <div className='card bg-white shadow-xl rounded-md'>
                {target.dropdown(args)}
            </div>
        ));
    } else {
        return btn;
    }
});

export interface IActionToolbarProps {
    /**@description 自定义工具栏 */
    items?: IToolbarItem[];
    /**@description 自定义资源表 */
    sources?: Record<string, any>;
    /**@description 是否有工具栏 */
    toolbar?: boolean;
}
/**@description 工具栏 */
export default observer(function (props: IActionToolbarProps) {
    const { toolbar, items, sources } = props;
    const driver = useDriver();
    if (!toolbar || !driver.editable) {
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
        <div className={driver.prefix("toolbar")}>
            {list}
        </div>
    )
});