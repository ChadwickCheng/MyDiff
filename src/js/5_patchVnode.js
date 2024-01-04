import createElement from "./4_createElement";
import updateChildren from "./6_updateChildren";
/*
接下来就是比较新旧虚拟节点
*/

export default function patchVnode(oldVnode,newVnode){
  // 新旧虚拟节点是否指向内存中的同一个对象？是，什么都不做。不是，走流程。
  if(oldVnode === newVnode) return;
  /* 
    新节点是否有text？
    有text，无children，走判断
    无text，有children，走流程
  */
  if(newVnode.text != undefined && (newVnode.children==undefined||newVnode.children.length==0)){
    console.log('新节点有text');
    /*
      新旧节点text是否相同？
      相同，什么都不做
      不同，新节点text覆盖老节点innerText
    */
    if(newVnode.text != oldVnode.text){
      oldVnode.elm.innerText = newVnode.text;
    }
  }else{
    // 新节点没有text有children
    console.log('新节点没有text');
    /*
      旧节点有children吗？
      没有children，有text。清空旧节点text，添加新节点children
      有children无text，最复杂的一种情况，走流程
    */
   if(oldVnode.children != undefined&&oldVnode.children.length>0){
     // 老节点有children，最复杂，走流程
     updateChildren(oldVnode.elm,oldVnode.children,newVnode.children);
   }else{
     oldVnode.elm.innerHtml = '';
     for(let i=0;i<newVnode.children.length;i++){
      let dom = createElement(newVnode.children[i]);
      oldVnode.elm.appendChild(dom);
     }
   }
  }
}