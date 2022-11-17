/** 列宽部分，因为thead有可能不展示 */
import React from 'react'
import { observer } from 'mobx-react-lite'
import { useDriver } from '../DriverContext'
const ColItem = observer(function (props: { value }) {
    return <col style={'width' in props.value && /\d+/.test(props.value.width) ? { width: props.value.width } : {}} />;
})
export default observer(function () {
    const driver = useDriver();
    return (
        <colgroup>
            {driver.renderCols.map((col, idx) => <ColItem key={idx} value={col} />)}
            {driver.tableProps.editable ? <col style={{width: 0}} key="resize-handle"/> : null}
        </colgroup>
    )
})