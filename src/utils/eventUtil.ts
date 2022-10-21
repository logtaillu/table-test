import { IEventItem } from "../services/ITableService";
import TableDriver from "../tableDriver/TableDriver";
// driver/event/func
class EventControler {
    private events: Map<keyof WindowEventMap, Map<TableDriver, any[]>> = new Map();
    private funcs: Map<keyof WindowEventMap, any> = new Map();

    private getMap<T>(map: Map<any, any>, key: any, defaultValue: () => T): T {
        if (!map.has(key)) {
            const newvalue = defaultValue();
            map.set(key, newvalue);
            return newvalue;
        } else {
            return map.get(key);
        }
    }
    // 添加事件
    addEvents(driver: TableDriver, events: IEventItem[]) {
        events.map(event => {

            const { name, func } = event;
            const eventTarget = this.getMap<Map<any, any>>(this.events, name, () => new Map());
            const driverTarget = this.getMap<any[]>(eventTarget, driver, () => ([]));
            driverTarget.push(func);
            this.addFunc(name);

        })
    }
    // 获取事件函数
    private getEvent(name: keyof WindowEventMap) {
        const events = this.events;
        return (e: any) => {
            const emap = events.get(name);
            if (emap) {
                emap.forEach((funcs, driver) => {
                    if (driver.isEventTarget(e)) {
                        funcs.map(func => {
                            func(driver, e);
                        });
                    }
                })
            }
        }
    }
    // 注册事件
    private addFunc(name: keyof WindowEventMap) {
        if (!this.funcs.has(name)) {
            const event = this.getEvent(name);
            this.funcs.set(name, event);
            window.addEventListener(name, event);
        }
    }

    private removeFunc(name: keyof WindowEventMap) {
        if (this.funcs.has(name)) {
            const event = this.funcs.get(name);
            window.removeEventListener(name, event);
            this.funcs.delete(name);
        }
    }

    // 移除
    removeEvents(driver: TableDriver) {
        const events = this.events;
        events.forEach((emap, ename) => {
            if (emap.has(driver)) {
                emap.delete(driver);
                if (emap.size === 0) {
                    events.delete(ename);
                    this.removeFunc(ename);
                }
            }
        })
    }

}
const eventUtil = new EventControler();
export default eventUtil;