export function isFunction(val) {
    return typeof val === "function";
}

export function isObject(val) {
    return typeof val === "object" && val !== null;
}

let callbacks = [];
let waiting = false;

function flushCallbacks() {
    callbacks.forEach(fn => fn()); // 按照顺序清空nextTick
    callbacks = [];
    waiting = false;
}

export function nextTick(fn) { // vue3里面的nextTick就是promise，vue2里面做了一些兼容性处理
    callbacks.push(fn);
    if (!waiting) {
        return Promise.resolve().then(flushCallbacks);
        waiting = true;
    }
}

export let isArray = Array.isArray;

let strats = {}; // 存放所有策略

let lifeCycle = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
]
lifeCycle.forEach(hook => {
    strats[hook] = function (parentVal, childVal) {
        if (childVal) {
            if (parentVal) { // 父子都有值，用父和子拼接在一起，父有值就一定是数组
                return parentVal.concat(childVal);
            } else { // 儿子有值，父亲没有值
                if (isArray(childVal)) {
                    return childVal;
                }
                return [childVal]; // 如果没有值，就会变成数组
            }
        } else {
            return parentVal;
        }
    }
});

export function mergeOptions(parentVal, childVal) {
    const options = {};

    for (let key in parentVal) {
        mergeFiled(key);
    }
    for (let key in childVal) {
        if (!parentVal.hasOwnProperty(key)) {
            mergeFiled(key);
        }
    }

    function mergeFiled(key) {
        // 设计模式 策略模式
        let strat = strats[key];
        if (strat) {
            options[key] = strat(parentVal[key], childVal[key]);
        } else {
            options[key] = childVal[key] || parentVal[key];
        }
    }

    return options;
}
