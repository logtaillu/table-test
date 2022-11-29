/** table入口，控制driver注册和回传 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import EvDriver from '../../driver/EvDriver';
import { ITableProps } from '../../interfaces/ITableProps';
import { DriverContext } from '../context/DriverContext';
export default React.forwardRef(function (props: ITableProps, ref) {
    const pdriver = props.driver;
    const [driver, setDriver] = useState(() => pdriver || new EvDriver());
    useEffect(() => {
        if (pdriver) {
            setDriver(pdriver);
        }
    }, [pdriver]);
    // ref，将driver提供出去
    useImperativeHandle(ref, () => ({
        driver: () => driver
    }));
    return (
        <DriverContext.Provider value={driver}>

        </DriverContext.Provider>
    );
})