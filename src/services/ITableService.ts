import { TableProps } from "rc-table/lib/Table";
import TableDriver from "../tableDriver";
import { IAcitonServiceMap } from "../tableDriver/ITableDriver";

export interface ITableService {
    /**@description props处理 */
    enrichProps: (tableProps: TableProps<any>, driver: TableDriver) => TableProps<any>;
    /**@description 栈操作 */
    actions: IAcitonServiceMap;
    /**@description 本地化 */
    locales?: any;
}