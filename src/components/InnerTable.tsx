import { observer } from 'mobx-react-lite';
import Table from 'rc-table';
import merge from "lodash.merge";
import TableDriver from '../tableDriver';
import { TableProps } from 'rc-table/lib/Table';
import { ITableService } from '../services/ITableService';
import { prefix } from '../utils/basicUtil';
export interface IInnerTableProps {
    driver: TableDriver;
    table: TableProps<any>;
    services?: ITableService[];
}
export default observer(function (props: IInnerTableProps) {
    const { driver, table, services } = props;
    const coreconf = {};
    // 修改props
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
        prefixCls={prefix()}
        {...passToTable}
    />;
});