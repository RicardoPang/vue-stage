import Watcher from "./observe/watcher";
import {patch} from "./vdom/patch";

export function mountComponent(vm) {

    // 初始化流程
    let updateComponent = () => {
        vm._update(vm._render());  // render()  _c _v _s
    }

    // 每个组件都有一个watcher，我们把这个watcher称之为渲染watcher
    callHook(vm, "beforeCreate");
    new Watcher(vm, updateComponent, () => {
        console.log('后续增添更新钩子函数 update')
        callHook(vm, "created");
    }, true);
    callHook(vm, "mounted");

    // updateComponent()
}

export function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // 采用的是 先序深度遍历 创建节点 （遇到节点就创造节点，递归创建）
        const vm = this;

        // 第一次渲染是根据虚拟节点生成真实节点，替换掉原来的节点
        // 如果是第二次，生成一个新的虚拟节点，和老的虚拟节点进行对比
        vm.$el = patch(vm.$el, vnode)
    }
}

export function callHook(vm, hook) {
    let handlers = vm.$options[hook];
    handlers && handlers.forEach(fn => {
        fn.call(vm); // 生命周期的this永远指向实例
    })
}
