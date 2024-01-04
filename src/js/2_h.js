/*
vnode参数顺序 sel,data,children,text,elm

在这一系列的实践中我们认为，一个虚拟dom节点如果有children属性，那么它的text属性一定是undefined，反之亦然。当然这是反直觉的，真正实践的时候要完善这个边界条件。

必须且只能接受三个参数 sel：标签名 data：属性对象 c，需要对c进行判断实现重载
三种调用形式
  1. h('div',{},'文字')
  2. h('div',{},[])
  3. h('div',{},h())
*/

import vnode from './1_vnode'

export default function (sel,data,c){
  // 检查参数个数
  if(arguments.length != 3){
    throw new Error('h函数必须传入三个参数')
  }
  // 检查c的类型
  // 情况1：c是标签体内容，即c是字符串或者数字
  if(typeof(c) === 'string' || typeof(c) === 'number'){
    return vnode(sel,data,undefined,c,undefined)
  //情况2：c是数组，数组中的元素必须是h函数返回的vnode 
  }else if(Array.isArray(c)){
    let children = [];
    for(let i=0;i<c.length;i++){
      if(!(typeof(c[i]) === 'object' && c[i].hasOwnProperty('sel'))){
        throw new Error('传入的数组参数中有项不是h函数返回的vnode')
      }
      // 给children添加子元素
      children.push(c[i])
    }
    return vnode(sel,data,children,undefined,undefined);
    // 情况3：c是对象，即c是h函数返回的vnode
  }else if(typeof(c)==='object'&&c.hasOwnProperty('sel')){
    let children = [c];
    return vnode(sel,data,children,undefined,undefined);
  }else{
    throw new Error('传入的第三个参数类型不对')
  }
}