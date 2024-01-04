// 生成虚拟dom节点对象
export default function (sel,data,children,text,elm){
  const key = data.key;
  return {
    sel,
    data,
    children,
    text,
    elm,
    key
  }
}