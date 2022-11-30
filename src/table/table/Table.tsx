import { observer } from 'mobx-react-lite'
import React, { useRef } from 'react'
import useResize from '../../hooks/useResize';
import { useDriver } from '../context/DriverContext';
export default observer(function () {
    const driver = useDriver();
    const ref = useRef(null);
    const { width } = useResize(ref, { handleH: false });
    return (
        <div ref={ref}>

        </div>
    )
})