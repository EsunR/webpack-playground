export function cloneDeep(obj, hash = new WeakMap()) {
  if (obj == null) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  const val = hash.get(obj);
  if (val) {
    return val;
  }

  // 获取传入对象/方法的构造函数
  const cloneObj = new obj.constructor();

  for (let key in obj) {
    // 添加对象/ 数组 的自由属性，继承属性过滤
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = cloneDeep(obj[key], hash);
      hash.set(obj, cloneObj);
    }
  }
  return cloneObj;
}
