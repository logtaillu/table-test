import React, { useEffect, useRef, useState } from 'react'
import { TableCore, LogView, observer, EvDriver } from "../src";
import useUpdate from '../src/hooks/useUpdate';
import { ITableRef } from '../src/interfaces/ITableProps';
import "../src/styles/index.less";
const getData = (str: string, num: number) => {
    const keys = str.split("");
    let res: any[] = [];
    for (let i = 0; i < num; i++) {
        let row: any = {};
        keys.map((k, idx) => row[k] = `${k}-${idx}-${num}`);
        res.push(row);
    }
    return res;
}
export default observer(function () {
    const [driver] = useState(new EvDriver());
    useEffect(() => {
        driver.action.on("onContentInit", (value) => {
            console.log(value);
        })
    }, []);
    const update = useUpdate();
    return (
        <div style={{ padding: 30, background: "#f5f5f5" }}>
            <button onClick={update} className='btn'>更新</button>
            <TableCore
                driver={driver}
                // tableLayout='fixed'
                // editable={true}
                // toolbar={true}
                // content={{
                //     all: {
                //         col: { colWidth: 100 }
                //     },
                //     rowCount: 4
                // }}
                // columns={[
                //     { dataIndex: "a", title: "a" },
                //     { dataIndex: "b", title: "b" },
                //     { dataIndex: "c", title: "c" },
                // ]}
                // expand={false}
                // scroll={true}
                // data={[
                //     { a: 1, b: 2, c: 3 },
                //     { a: 4, b: 5, c: 6 }
                // ]}
                debug={true}
                lang="zh-CN"
            // style={{}}
            />
            <LogView />
        </div>
    )
})