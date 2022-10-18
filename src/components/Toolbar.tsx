/**
 * 工具栏
 */
import React from 'react'
import { observer } from 'mobx-react-lite';
import TableDriver from '../tableDriver';
import { IToolbarItem, IToolbarItemObj } from '../toolbarItems/IToolbarItem';
import ToolbarItem from '../toolbarItems/ToolbarItem';
import classnames from "classnames";
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
    const source = sources && sources[target.key] || target.source;
    const click = () => {
        if (target.onClick) {
            target.onClick(driver, source);
        }
    };
    const disabled = target.disabled ? target.disabled(driver, source) : false;
    const active = target.active ? target.active(driver, source) : false;
    const cls = classnames({
        "btn": true,
        "btn-square": true,
        "btn-disabled": disabled,
        "btn-active": active
    })
    const btn = (
        <div className="tooltip" data-tip={target.tooltip(driver, source)} key={target.key} tabIndex={0}>
            <button className={cls} onClick={click} disabled={disabled} >
                {target.icon(driver, source)}
            </button>
        </div>
    );
    if (target.dropdown) {
        return (
            <div className="dropdown" key={target.key}>
                {btn}
                <div tabIndex={0} className="dropdown-content card card-compact w-auto p-2 shadow bg-white text-primary-content">
                    <div className="card-body">
                        {target.dropdown(driver, source)}
                    </div>
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
    /**@description 是否有工具栏 */
    toolbar?: false | {
        /**@description 自定义工具栏 */
        items?: IToolbarItem[];
        /**@description 自定义资源表 */
        sources?: Record<string, any>;
    };
}
/**@description 工具栏 */
export default observer(function (props: IActionToolbarProps) {
    const { toolbar, driver } = props;
    if (!toolbar) {
        return null;
    }
    const list = (toolbar.items || ToolbarItem.defaultList).map((item, idx) => {
        const target = ToolbarItem.item(item);
        if (!target) {
            return <div key={idx} />;
        } else {
            return <ReactToolbarItem key={target.key} driver={driver} target={target} sources={toolbar.sources} />;
        }
    });
    return (
        <div className={driver.prefix("toolbar")}>
            {list}
        </div>
    )
});