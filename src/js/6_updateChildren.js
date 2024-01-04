import patchVnode from './5_patchVnode'
import createElement from './4_createElement'
/*
  最复杂情况
*/

// 判断两节点是否是同一个虚拟节点
function checkSameVnode(a,b){
  return a.sel == b.sel && a.key == b.key;
};

export default function updateChildren(parentElm,oldCh,newCh){
  console.log('我是updateChildren');
  console.log(oldCh,newCh);

  // 旧前
  let oldStartIdx = 0;
  // 新前
  let newStartIdx = 0;
  // 旧后
  let oldEndIdx = oldCh.length-1;
  // 新后
  let newEndIdx = newCh.length-1;
  // 旧前节点
  let oldStartVnode = oldCh[0];
  // 旧后节点
  let oldEndVnode = oldCh[oldEndIdx];
  // 新前节点
  let newStartVnode = newCh[0];
  // 新后节点
  let newEndVnode = newCh[newEndIdx];

  let keyMap = null;

  // 最外层while
  while(oldStartIdx<=oldEndIdx&&newStartIdx<=newEndIdx){
    console.log('我是最外层while');
    // 首先不是判断四种命中情况，而是要略过已经加undefined标记的项。否则会出现undefined和undefined比较，导致旧前和新前命中，但是实际上是两个undefined在比较。
    if(oldStartVnode==null||oldCh[oldStartIdx]==undefined){
      oldStartVnode = oldCh[++oldStartIdx];
    }else if(oldEndVnode==null||oldCh[oldEndIdx]==undefined){
      oldEndVnode = oldCh[--oldEndIdx];
    }else if(newStartVnode==null||newCh[newStartIdx]==undefined){
      newStartVnode = newCh[++newStartIdx];
    }else if(newEndVnode==null||newCh[newEndIdx]==undefined){
      newEndVnode = newCh[--newEndIdx];
    }else if(checkSameVnode(oldStartVnode,newStartVnode)){
      // 1. 新前和旧前
      console.log('情况1,新前和旧前命中');
      // 继续递归比较这两个节点 注意pacthVnode第一个参数是旧
      patchVnode(oldStartVnode,newStartVnode);
      // 前指针后移
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }else if(checkSameVnode(oldEndVnode,newEndVnode)){
      // 2. 新后和旧后
      console.log('情况2,新后和旧后命中');
      patchVnode(oldEndVnode,newEndVnode);
      // 后指针前移
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }else if(checkSameVnode(oldStartVnode,newEndVnode)){
      // 3. 新后和旧前
      console.log('情况3,新后和旧前命中');
      patchVnode(oldStartVnode,newEndVnode);
      // 情况3 需要移动节点，新前节点放在旧后之后。注意，要改变的是旧节点，操纵旧节点位置，此时新后==旧前，所以下面是oldStartVnode.elm
      parentElm.insertBefore(oldStartVnode.elm,oldEndVnode.elm.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }else if(checkSameVnode(oldEndVnode,newStartVnode)){
      // 4. 新前和旧后
      console.log('情况4,新前和旧后命中');
      patchVnode(oldEndVnode,newStartVnode);
      // 情况4 需要移动节点，新前节点放在旧前之前
      parentElm.insertBefore(oldEndVnode.elm,oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }else{
      // 四种情况没有命中 都没命中对旧循环找到与新前匹配的节点，移动到旧前之前.找不到与新前匹配的节点则将新前转为真实dom插入到旧前之前。无论如何都要移动到旧前之前。之后新前指针后移
      // keyMap是映射对象
      if(!keyMap){
        keyMap = {};
        // 从oldStartIdx到oldEndIdx这段区间创建keyMap
        for(let i=oldStartIdx;i<=oldEndIdx;i++){
          const key = oldCh[i].key;
          if(key!=undefined){
            keyMap[key] = i;
          }
        }
      }
      // 寻找当前这项（newStartIdx）这项在keyMap中映射的位置序号
      const idxInOld = keyMap[newStartVnode.key];
      if(idxInOld==undefined){
        // 判断，如果idxInOld是undefined表示它是全新的项
        // 被加入的项（就是newStartVnode这项）现在不是真正的dom节点,需要先转换为dom节点
        parentElm.insertBefore(createElement(newStartVnode),oldStartVnode.elm);
      }else{
        // 如果不是undefined，不是全新的项，而是需要移动的项
        const elmToMove = oldCh[idxInOld];
        // 移动
        patchVnode(elmToMove,newStartVnode);
        // 把这项设置为undefined，表示我已经处理完这项了
        oldCh[idxInOld] = undefined;
        // 移动，调用insertBefore也可以实现移动
        parentElm.insertBefore(elmToMove.elm,oldStartVnode.elm);
      }
      // 指针下移，只移动新的头
      newStartVnode = newCh[++newStartIdx];
    }
  }

  /*
    旧节点先循环完，新节点有需要插入的节点，加入到旧前之前
    新节点先循环完，老节点有剩余节点(旧前旧后中)，全部删除
  */
 if(newStartIdx <= newEndIdx){
  console.log('new还有剩余节点没有处理，要加入到旧前之前');
  // 遍历剩余的newCh中的项，添加到旧前之前
  for(let i=newStartIdx;i<=newEndIdx;i++){
    // 这里需要注意:insertBefore 方法的第二个参数是参考节点。如果这个参数是 null，那么新节点将被插入到父节点的子节点列表的末尾。
    parentELm.insertBefore(createElement(newCh[i]),oldCh[oldStartIdx].elm);
  }
 }else if (oldStartIdx <= oldEndIdx){
  console.log('old还有剩余节点没有处理，要删除');
  // 遍历剩余的oldCh中的项，删除
  for(let i=oldStartIdx;i<=oldEndIdx;i++){
    if(oldCh[i]){
      parentElm.removeChild(oldCh[i].elm);
    }
  }
 }
}