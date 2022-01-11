import { observe } from "./observe";
import { isFunction } from "./utils";

export function initState(vm) {
  const opts = vm.$options;

  if (opts.data) {
    initData(vm);
  }
}

function proxy(vm, key, source) {
  // 取值的时候做代理，不是暴力的把_data 属性赋予给vm，而且直接赋值会有命名冲突问题
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]; // vm._data.message
    },
    set(newValue) {
      vm[source][key] = newValue; // vm._data.message = newValue
    },
  });
}

function initData(vm) {
  let data = vm.$options.data; // 用户传入的数据

  // 如果用户传入的是一个函数，则取函数的返回值作为对象，如果就是对象那就直接使用这个对象
  // 只有根实例可以data是一个对象

  // data和vm._data引用的是同一个人 -> data被劫持了 vm._data 也被劫持了
  data = vm._data = isFunction(data) ? data.call(vm) : data; // _data已经是响应式的了

  // 需要将data变成响应式的 Object.defineProperty 重写data中的所有属性
  observe(data); // 观测对象中的属性

  for (let key in data) {
    // vm.message => vm._data.message
    proxy(vm, key, "_data"); // 代理vm上的取值和设置值和vm._data没关系了
  }
}
