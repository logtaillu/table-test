import { IDriverCache, IMultiRangeSetter } from "../interfaces/IDriverCache";
import { ICellRange } from "../interfaces/IGlobalType";
import { IColumn, IColumnGroup, IColumnList, IRenderCol } from "../interfaces/ITableProps";
import { deepMapAry, getDeep } from "../utils/baseUtil";
import EvDriver from "./EvDriver";

export default function (driver: EvDriver, content?: IDriverCache, columns?: IColumnList, data?: any[]) {
    // reset content
    driver.content = content;
    const setary: IMultiRangeSetter = [];
    // 1. header深度
    const deep = getDeep(columns || []);
    setary.push({ value: deep, path: ["deep"], type: "wrap" });

    // 2. 更新colCount,更新width配置，获取渲染列
    let columnCount = driver.getValue("wrap", ["colCount"]);
    let startCol = columnCount;
    let headerCols: IRenderCol[][] = [];
    let renderCols: IRenderCol[] = [];
    const merged: ICellRange[] = [];
    const handleColumns = ({ item, x, y, isLeaf, rowspan, colspan }) => {
        // 更新colCount
        columnCount = Math.max(x + 1, columnCount);
        const col: IRenderCol = {
            ...item, isLeaf,
            row: y, col: x,
            rowSpan: rowspan,
            colSpan: colspan
        }
        const range = { col: col.col };
        // 转化align和width
        if (isLeaf) {
            renderCols.push(col);
            setary.push({ type: "colcell", path: ["--ev-ah"], value: col.align, grange: "body", range });
            setary.push({ type: "colcell", path: ["--ev-ah"], value: col.align, grange: "header", range });
            setary.push({ type: "col", path: ["colWidth"], value: col.width, range });

        } else {
            setary.push({ type: "cell", path: ["--ev-ah"], value: col.align, range });
        }
        if (rowspan > 1 || colspan > 1) {
            const mergedRange: ICellRange = {
                from: { col: x, row: y, type: "header" },
                to: { col: x + colspan, row: y + rowspan, type: "header" }
            };
            merged.push(mergedRange);
        }
        headerCols[y] = headerCols[y] || [];
        headerCols[y].push(col);
        return {};
    };
    deepMapAry<IColumnGroup | IColumn>(columns || [], handleColumns, deep);
    
    // 补充列
    const gapcol = startCol - columnCount;
    for (let i = 0; i < gapcol; i++){
        const col: IRenderCol = {
            dataIndex: `expand${i}`,
            isLeaf: true,
            row: 0, col: i,
            rowSpan: deep,
            colSpan: 1,
            title: ""
        }
        renderCols.push(col);
        headerCols[0] = headerCols[0] || [];
        headerCols[0].push(col);
        if (deep > 1) {
            merged.push({
                from: { col: col.col, row: col.row, type: "header" },
                to: { col: col.col + col.colSpan, row: col.row + col.rowSpan, type: "header" }
            });
        }
    }


    setary.push({ value: columnCount, path: ["colCount"], type: "wrap" });
    driver.setValues(setary);

    driver.renderCols = renderCols; // 底层
    driver.columns = headerCols; // 渲染表头

    // 合并单元格处理
    driver.content.merged = driver.content.merged || [];
    driver.content.merged = driver.content.merged.filter(s => s.from.type === "header");
    merged.map(mr => driver.content.merged?.push(mr));

    // 行数
    driver.data = (data || []).concat([]);
    const rowCount = driver.content.rowCount = Math.max(driver.data.length, driver.content.rowCount || 0);

    // 补充行
    const gaplen = rowCount - driver.data.length;
    for (let i = 0; i < gaplen; i++){
        driver.data.push({});
    }
}