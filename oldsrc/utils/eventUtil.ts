/** 事件监听 */
import EvDriver from "../driver/EvDriver";
import { IEventName } from "../interfaces/IPlugin";

class EventController {
    private typeEvents: Map<IEventName, any> = new Map();
    private drivers: EvDriver[] = [];
    /** 注册控制器 */
    add(driver: EvDriver) {
        this.drivers.push(driver);
        driver.events.forEach((value, name) => {
            this.addEvent(name);
        });
    }
    /** 移除控制器 */
    remove(driver: EvDriver) {
        this.drivers = this.drivers.filter(d => d !== driver);
        this.typeEvents.forEach((value, key) => {
            this.removeEvent(key);
        });
    }
    /** 事件是否仍然存在 */
    isEventExist(name: IEventName) {
        const idx = this.drivers.findIndex(d => d.events.has(name));
        return idx >= 0;
    }

    /** 生成事件 */
    private generateEvent(name: IEventName) {
        const drivers = this.drivers;
        return e => {
            drivers.map(d => {
                // 是否事件目标
                if (d.isEventTarget(e)) {
                    // 遍历事件并执行
                    d.events.get(name)?.forEach(item => {
                        if (name !== "keydown" || (e.ctrlKey === (!!item.ctrl) && e.key.toLowerCase() === item.key?.toLocaleLowerCase())) {
                            item.func(d, e);
                        }
                    });
                }
            })
        }
    }
    /**挂载监听器 */
    addEvent(name: IEventName) {
        if (!this.typeEvents.has(name)) {
            const func = this.generateEvent(name);
            this.typeEvents.set(name, func);
            window.addEventListener(name, func);
        }
    }
    /** 卸载监听器 */
    removeEvent(name: IEventName) {
        if (this.typeEvents.has(name) && !this.isEventExist(name)) {
            window.removeEventListener(name, this.typeEvents.get(name));
            this.typeEvents.delete(name);
        }
    }
}

const eventUtil = new EventController();
export default eventUtil;