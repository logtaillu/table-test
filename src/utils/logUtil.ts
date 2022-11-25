// 开发时，日志输出用
class LogUtil {
    constructor() {
        this.timeclick = this.timeclick.bind(this);
    }
    // 输出哪些类型
    types: Set<string> = new Set();
    // 是否启动
    started = false;
    // 时间缓存
    times: Map<string, { start: number, prev: number }> = new Map();
    // 按类别的日志输出
    logs: Map<string, any[]> = new Map();
    logChange = false;
    timer: NodeJS.Timeout | null = null;
    clear() {
        if (this.logs.size > 0) {
            this.times.clear();
            this.logs.clear();
            this.logChange = true;
        }
    }
    change(debug: string[] | boolean) {
        if (debug) {
            this.start(Array.isArray(debug) ? debug : []);
        } else {
            this.stop();
        }
    }
    timeclick() {
        if (this.started) {
            if (this.logChange) {
                this.logChange = false;
                window.dispatchEvent(new CustomEvent("logupdate"));
            }
            this.timer = setTimeout(this.timeclick, 100);
        }
    }
    // 启动，确定可输出类型，types为空时输出全部类型
    start(types: string[] = []) {
        this.times.clear();
        this.types.clear();
        this.logChange = false;
        types.map(t => this.types.add(t));
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.started = true;
        this.timeclick();
    }
    // 停止
    stop() {
        this.times.clear();
        this.types.clear();
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.started = false;
    }
    // 输出
    log(type: string, ...infos) {
        if (!this.started) {
            return;
        }
        const logable = this.types.size <= 0 || this.types.has(type);
        if (logable) {
            let typeInfo = this.times.get(type);
            const cur = new Date().getTime();
            let total = 0;
            let prev = 0;
            if (!typeInfo) {
                this.times.set(type, { start: cur, prev: cur });
            } else {
                total = (cur - typeInfo.start) / 1000;
                prev = (cur - typeInfo.prev) / 1000;
                typeInfo.prev = cur;
            }
            const loginfo = { infos, total, prev };
            if (!this.logs.has(type)) {
                this.logs.set(type, [loginfo]);
            } else {
                const typelog = this.logs.get(type);
                typelog?.push(loginfo);
            }
            console.log(`[${type}]`, `用时：${prev}s`, `总时长：${total}s`);
            console.log(`[${type}]`, ...infos);
            this.logChange = true;
        }
    }
}

const logUtil = new LogUtil();
export default logUtil;