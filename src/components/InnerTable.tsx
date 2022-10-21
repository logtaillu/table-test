/**
 * 基于rc-table的表格组件，
 */
import { observer } from 'mobx-react-lite';
import Table from 'rc-table';
import merge from "lodash.merge";
import TableDriver from '../tableDriver/TableDriver';
import { TableProps } from 'rc-table/lib/Table';
import { ITableService } from '../services/ITableService';
export interface IInnerTableProps {
    /**@description 控制器 */
    driver: TableDriver;
    /**@description rc-table表格参数 */
    table: TableProps<any>;
    /**@description 启用的服务列表 */
    services?: ITableService[];
}
export default observer(function (props: IInnerTableProps) {
    const { driver, table, services } = props;
    const coreconf = {};
    // 遍历services修改props
    const enrichTableProps = () => {
        let result = merge({}, table);
        (services || []).map(s => {
            const serviceRes = s.enrichProps(result, driver);
            result = merge(result, serviceRes);
        })
        return result;
    }
    const passToTable = enrichTableProps();
    return <Table
        rowKey={(r, i) => (i || 0).toString()}
        prefixCls={driver.prefixCls}
        {...passToTable}
    />;
});