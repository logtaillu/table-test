import { observer } from 'mobx-react-lite';
import TableDriver from '../tableDriver';
export interface IActionToolbarProps {
    driver: TableDriver;
    toolbar?: boolean;
}
export default observer(function (props: IActionToolbarProps) {
    const { toolbar } = props;
    if (!toolbar) {
        return null;
    }
    return <div>占位</div>;
});