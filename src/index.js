import {initMixin} from "./init";
import {renderMixin} from "./render";
import {lifeCycleMixin} from "./lifecycle";
import {initGlocalAPI} from "./global-api";
import {compileToFunction} from "./compiler";
import {createElm, patch} from "./vdom/patch";

// vue要如何实现，原型模式，所有的功能都通过原型扩展的方式来添加
function Vue(options) {
    this._init(options); // 实现vue的初始化功能
}

initMixin(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);
initGlocalAPI(Vue);

// // 先生成一个虚拟节点
// let vm1 = new Vue({
//     data() {
//         return {name: 'ricardo'}
//     }
// })
// let render1 = compileToFunction(`
//     <div>
//         <ul>
//             <li key="A">A</li>
//             <li key="B">B</li>
//             <li key="C">C</li>
//             <li key="D">D</li>
//         </ul>
//     </div>`);
// let oldVnode = render1.call(vm1); // 第一次的虚拟节点
// let el1 = createElm(oldVnode);
// document.body.appendChild(el1);
//
// let vm2 = new Vue({
//     data() {
//         return {name: '赵日天'}
//     }
// })
// let render2 = compileToFunction(`
//     <div>
//         <ul>
//             <li key="F">F</li>
//             <li key="B">B</li>
//             <li key="A">A</li>
//             <li key="E">E</li>
//             <li key="P">P</li>
//         </ul>
//     </div>`);
// let newVnode = render2.call(vm2);
// // let el2 = createElm(newVnode);
// // document.body.appendChild(el2);
// setTimeout(() => {
//     patch(oldVnode, newVnode); // 对比两个虚拟节点的差异，更新需要更新的地方
// }, 2000);

// 再去生成一个新的虚拟节点 patch
// 导出Vue给别人使用
export default Vue;

// 1. new Vue 会调用_init方法进行初始化操作
// 2. 会将用户的选项放到 vm.$options 上
// 3. 会对当前属性上搜索有没有data数据 initState
// 4. 有data判断data 是不是一个函数，如果是函数取返回值initData
// 5. observe去观测data中的数据和vm没关系，说明data已经变成响应式
// 6. vm上想取值也能取到data中的数据 vm._data = data 这样用户能取到data了 vm._data
// 7. 用户觉得有点麻烦 vm.xxx -> vm._data
// 8. 如果更新对象不存在的属性，会导致视图不更新，如果是数组，更新索引和长度不会触发更新
// 9. 如果是替换成一个对象，新对象会被进行劫持，如果是数组存放新内容 push unshift 新增的内容也会被劫持
// 10. 通过 __ob__ 进行标识这个对象被监控过（在vue中被监控的对象身上都有一个__ob__这个属性）
// 11. 如果你就想改索引，可以使用$set方法，内部就是splice()

// 如果el需要挂载到页面上


// 只有根组件的情况：每个属性都有一个dep
// 1. vue里面用到了观察者模式，默认组件渲染的时候，会创建一个watcher，（并且会渲染视图）
// 2. 当渲染视图的时候，会取data中的数据，会走每个属性的get方法，就让这个属性的dep记录watcher
// 3. 同时让watcher也记住dep（这个逻辑目前没用到）dep和watcher是多对多的关系，因为一个属性可能对应多个视图，一个视图对应多个数据
// 4. 如果数据发生变化，会通知对应属性的dep，依次通知存放的watcher去更新
