/*
将vnode转为真实dom节点。只实现孤儿节点，不进行插入。
*/

export default function createElement(vnode){
  // 按照vnode的sel创建孤儿真实dom节点
  let domNode = document.createElement(vnode.sel);
  // 有children还是有text
  if(vnode.text!=''&&(vnode.children==undefined||vnode.children.length==0)){
    // 有text，没有children
    domNode.innerText = vnode.text;
  }else if(Array.isArray(vnode.children)&&vnode.children.length>0){
    // 有children 无text，递归创建children的真实dom节点，上树。注意，孩子上父亲，父亲是孤儿
    for(let i=0;i<vnode.children.length;i++){
      // vnode.children的每个元素依旧是vnode
      let child = vnode.children[i];
      // 根据vnode递归创建真实dom节点
      let childDom = createElement(child);
      // 加到父亲身上
      domNode.appendChild(childDom);
    }
  }
  // vnode的elm是这个虚拟节点对应的真实dom节点
  vnode.elm = domNode;
  return vnode.elm;
}