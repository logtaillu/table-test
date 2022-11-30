/** 工具栏组 */
import { observer } from 'mobx-react-lite'
import React from 'react'
import { IToolbarItem } from '../../interfaces/IToolbar';
import ToolbarOperation from './ToolbarOperation';
export default observer(function ({group}:{group:IToolbarItem[]}) {
    return (
        <div className='toolbar-group'>
            {group.map((item, idx) => {
                const key = typeof (item) === "string" ? item : (item.key || idx);
                return <ToolbarOperation key={key} item={item} />;
            })}
        </div>
    );
});