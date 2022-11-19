/** 列宽部分，因为thead有可能不展示 */
import React from 'react'
import { observer } from 'mobx-react-lite'
import { useDriver } from '../DriverContext'
import { getColKey } from '../../utils/keyUtil';
const ColItem = observer(function (props: { value }) {
    const driver = useDriver();
    const w = driver.getValue("col", "colWidth", { col: props.value });
    return <col style={w ? { width: w } : {}} />;
})
export default observer(function () {
    const driver = useDriver();
    return (
        <colgroup>
            {driver.renderCols.map((col, idx) => <ColItem key={col.col} value={col.col} />)}
            {driver.tableProps.editable ? <col style={{width: 0}} key="resize-handle"/> : null}
        </colgroup>
    )
})