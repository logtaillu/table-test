import classNames from 'classnames';
import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
    const [active, setActive] = useState<string>(logUtil.logs.size > 0 ? logUtil.logs.keys().next().value : "");
    const [update, setUpdate] = useState({});
    const forceUpdate = useCallback(() => setUpdate({}), []);
    const logs = active ? logUtil.logs.get(active) : [];
    const ac = useRef(false);
    useEffect(() => {
        const func = () => {
            if (!ac.current) {
                ac.current = true;
                setActive(logUtil.logs.size > 0 ? logUtil.logs.keys().next().value : "");
            } else {
                forceUpdate();
            }
        }
        window.addEventListener("logupdate", func);
        return () => {
            window.removeEventListener("logupdate", func);
        }
    }, []);
    const childs: React.ReactNode[] = [];
    logUtil.logs?.forEach((value, type: string) => {
        childs.push(<div onClick={() => setActive(type)} className={classNames({ "tab": true, "tab-active": active === type })} key={type}>{type}</div>);
    })
    return (
        <div className='card shadow-md bg-base-100 mt-4'>
            <div className="card-body">
                <h2 className="card-title justify-between">日志记录
                    <button className='btn btn-primary w-20' onClick={() => logUtil.clear()}>清除</button>
                </h2>
                <div className="tabs tabs-boxed mb-2 p-3">
                    {childs}
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