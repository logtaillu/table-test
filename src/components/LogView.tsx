import classNames from 'classnames';
import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useDeepChange from '../hooks/useDeepChange';
import logUtil from '../utils/logUtil';
const LogItem = (props: { value, row }) => {
    const value = useDeepChange(() => props.value);
    return useMemo(() => {
        return (
            <tr>
                <th>{props.row + 1}</th>
                <td>{value?.prev}s</td>
                <td>{value?.total}s</td>
                <td>
                    {value?.infos?.map((s, i) => <div key={i}>{s}</div>)}
                </td>
            </tr>
        )
    }, [value, props.row]);
};

export default function () {
    const [active, setActive] = useState(logUtil.totalTypes[0]);
    const [update, setUpdate] = useState({});
    const forceUpdate = useCallback(() => setUpdate({}), []);
    const logs = logUtil.logs.get(active);
    useEffect(() => {
        const func = () => {
            forceUpdate();
        }
        window.addEventListener("logupdate", func);
        return () => {
            window.removeEventListener("logupdate", func);
        }
    }, []);
    return (
        <div className='card shadow-md bg-base-100 mt-4'>
            <div className="card-body">
                <h2 className="card-title justify-between">日志记录
                <button className='btn btn-primary w-20' onClick={() => logUtil.clear()}>清除</button>
                </h2>
                <div className="tabs tabs-boxed mb-2 p-3">
                    {logUtil.totalTypes.map(type => <div onClick={() => setActive(type)} className={classNames({ "tab": true, "tab-active": active === type })} key={type}>{type}</div>)}
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full table-compact">
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>用时</th>
                                <th>累计用时</th>
                                <th>内容</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs?.map((info, idx) => <LogItem key={idx} row={idx} value={info} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}