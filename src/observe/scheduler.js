import {nextTick} from "../utils";

let queue = []; // 这里存放将要更新的watcher
let has = {}; // 用来存储已有的watcher的id

function flushSchedulerQueue() {
    // beforeUpdate
    queue.forEach(watcher => watcher.run())
    queue = [];
    has = {};
    pending = false;
}

let pending = false;

export function queueWatcher(watcher) {
    // 一般情况下，写去重可以采用这种方式，如果你不使用set的时候
    let id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        queue.push(watcher);
        if (!pending) { // 防抖 多次执行 只走一次
            nextTick(flushSchedulerQueue);
            pending = true;
        }
    }
}