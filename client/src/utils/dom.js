// jquery offset原生实现
function offset(target) {
    let top = 0,
        left = 0;

    while(target.offsetParent) {
        top += target.offsetTop;
        left += target.offsetLeft;
        target = target.offsetParent
    }

    return {
        top: top,
        left: left,
    }
}


function queryElement(node,selectScope){
    let d = !selectScope ? document : selectScope;
    if(/\./.test(node)){
        node = node.replace('.','');
        //HTMLcollection 伪数组
        node = d.getElementsByClassName(node);
    }else if(/\#/.test(node)){
        node = node.replace('#','');
        //HTML元素
        node = d.getElementById(node);
    }else{
        //HTMLcollection 伪数组
        node = d.getElementsByTagName(node);
    }
    return node;
}

//类似jq的$().closest
function closest(node,parent){
    if(parent){
        parent = queryElement(parent);
        if(parent){
            while(node.nodeType !== 9){
                node = node.parentNode;
                // class tagName时判断伪数组中是否存在该node元素
                // id时判断是否相等
                if([].indexOf.call(parent,node) >= 0 || node === parent){
                    return node;
                }
            }
        }
    }
    return null;
}

export {
    offset,
    closest
}