// 动作相关函数
import { IActionItem } from "../interfaces/IActionStack";
import { setAndSaveValues } from "../utils/valueUtil";
import EvDriver from "./EvDriver";

/** 执行动作 */
export function doAction(driver: EvDriver, action: IActionItem, clearUndo: boolean = true) {
    const service = driver.acServiceMap.get(action.type);
    if (service) {
        const result = service.exec(driver, action.value);
        // 返回false，阻止继续执行
        if (result === false) {
            return;
        }
        // 有undo功能的action或者返回了undo栈，入栈
        if (service.undo || (Array.isArray(result) && result.length > 0)) {
            // 是否有keep栈，不覆盖undo
            const last = driver.actionStack.length ? driver.actionStack[driver.actionStack.length - 1] : null;
            if (last && last.keep === true && last.type === action.type) {
                last.value = action.value;
                last.keep = action.keep;
            } else {
                driver.actionStack.push({ ...action, undo: result || [] });
                if (driver.maxStack >= 0 && driver.actionStack.length > driver.maxStack) {
                    driver.actionStack.splice(0, driver.actionStack.length - driver.maxStack);
                }
            }
            if (clearUndo) {
                driver.undoStack = [];
            }
        }
    }
}

/** 重做 */
export function redo(driver: EvDriver) {
    if (driver.undoStack.length) {
        const nextAction = driver.undoStack.pop();
        if (nextAction) {
            doAction(driver, nextAction, false);
        }
    }
}

/** 撤销 */
export function undo(driver: EvDriver) {
    if (driver.actionStack.length) {
        const lastAction = driver.actionStack.pop();
        if (lastAction && driver.acServiceMap.has(lastAction.type)) {
            driver.undoStack.push(lastAction);
            const ac = driver.acServiceMap.get(lastAction.type);
            const func = ac?.undo;
            if (func) {
                func(driver, lastAction);
            } else {
                // set value用cache
                setAndSaveValues(driver.content, lastAction.undo || []);
            }
        }
    }
}