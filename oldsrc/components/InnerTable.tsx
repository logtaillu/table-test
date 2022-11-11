/**
 * 基于rc-table的表格组件，
 */
import { observer } from 'mobx-react-lite';
import Table from 'rc-table';
import { TableProps } from 'rc-table/lib/Table';
import { ITableService } from '../services/ITableService';
import { mergeConfig } from '../utils/columnUtil';
import { useDriver } from './DriverContext';
export interface IInnerTableProps {
    /**@description rc-table表格参数 */
    table: TableProps<any>;
    /**@description 启用的服务列表 */
    services?: ITableService[];
}
export default observer(function (props: IInnerTableProps) {
    const { table, services } = props;
    const driver = useDriver();
    // 遍历services修改props
    const enrichTableProps = () => {
        let result = mergeConfig({}, table);
        (services || []).map(s => {
            if (s.enrichProps) {
                const serviceRes = s.enrichProps(result, driver);
                result = mergeConfig(result, serviceRes);
            }
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