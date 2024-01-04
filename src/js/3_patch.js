import vnode from './1_vnode'
import createElement from './2_createElement'
import patchVnode from './4_patchVnode'

/*
vnode参数顺序 sel,data,children,text,elm

patch函数开始根据流程走

上树在patch和patchVnode中都有
*/

export default function patch(oldVnode,newVnode){
  // 旧节点是否为虚拟节点？是，走流程。不是，转换为虚拟节点。
  if(oldVnode.sel == '' || oldVnode.sel == undefined){
    // 这里看似是个bug，其实就是bug。本次手写最后还是比较两个虚拟，所以不会遇到真实dom情况。如果是真实dom，明显中间三项不能简单设置为undefined。如果data暴力设置为空，之后比较就没有key，就肯定不是同一个节点，就会暴力删除旧的，插入新的。
    oldVnode = vnode(oldVnode.tagName.toLowerCase(),{},[],undefined,oldVnode)
  }
  // 判断oldVnode和newVnode是否是同一个节点
  if(oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel){
    console.log('是同一个节点')
    // 是同一个节点 走流程
    patchVnode(oldVnode,newVnode)
  }else{
    console.log('不是同一个节点，暴力插入新的，删除旧的')
    let newVnodeElm = createElement(newVnode)
    if(oldVnode.elm.parentNode && newVnodeElm){
      // 插入到老节点之前
      oldVnode.elm.parentNode.insertBefore(newVnodeElm,oldVnode.elm)
    }
    // 先插后删 先删就找不到了
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}