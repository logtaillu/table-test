import { TableProps } from "rc-table/lib/Table";
import TableDriver from "../tableDriver/TableDriver";
import { IAcitonServiceMap } from "../tableDriver/ITableDriver";
export interface IEventItem {
    name: keyof WindowEventMap;
    func: (driver: TableDriver, e: any) => void;
}
export interface ITableService {
    /**@description props处理 */
    enrichProps: (tableProps: TableProps<any>, driver: TableDriver) => TableProps<any>;
    /**@description 栈操作 */
    actions: IAcitonServiceMap;
    events: IEventItem[];
}