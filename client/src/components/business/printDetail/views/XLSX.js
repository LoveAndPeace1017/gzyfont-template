var maxTdLen = 0;
const displayTags = ['H1', 'H2', 'H3', 'DIV', 'P'];
const displayInlineTags = ['#text', 'SPAN', 'IMG', 'STRONG'];

/**
 * 替换P标签为span标签
 * @param content
 */
const replacePTagsToSpan = function (content) {
    content = content.replaceAll("<p", "<span");
    content = content.replaceAll("</p>", "</span>\n<br/>");
    return content;
};

/**
 * 获取表格td的个数
 * @param dom dom结点
 */
const getTdLen = function (dom) {
    if(dom.childNodes.length > 0){
        for(let i=0; i<dom.childNodes.length;i++){
            if(dom.childNodes[i].nodeName === 'TR'){
                let tdLength = 0;
                let curChildNodes = dom.childNodes[i].childNodes;
                for(let j=0; j<curChildNodes.length;j++){
                    if((curChildNodes[j].nodeName === 'TH' || curChildNodes[j].nodeName === 'TD')
                        && curChildNodes[j].style.display !== 'none')  // 当td或th的样式设置为display: none时，不计算个数
                        tdLength++;
                }
                if(tdLength > maxTdLen) maxTdLen = tdLength;
            } else {
                getTdLen(dom.childNodes[i]);
            }
        }
    }
};

/**
 * 调整表格宽度
 * @param dom dom结点
 */
const convertTableWidth = function (dom) {
    const tableNodes = dom.childNodes[0].getElementsByTagName('table');
    for(let i=0;i<tableNodes.length;i++){
        let tableNode = tableNodes[i];
        let trNodes = tableNode.getElementsByTagName('tr');
        for(let j=0;j<trNodes.length;j++){
            let tdNodes = trNodes[j].getElementsByTagName('td');
            let thNodes = trNodes[j].getElementsByTagName('th');
            let nodes = tdNodes.length > 0 ? tdNodes : thNodes;

            let newNodes = [];
            for(let n=0;n<nodes.length;n++){
                if(nodes[n].style.display !== 'none')
                    newNodes.push(nodes[n]);
            }
            let sum = 0;
            for(let w=0;w<newNodes.length;w++){
                if(w!==newNodes.length-1){
                    let colSpan = Math.floor(maxTdLen/newNodes.length);
                    newNodes[w].colSpan = colSpan;
                    sum += colSpan;
                }else {
                    newNodes[w].colSpan = maxTdLen - sum;
                }
            }
        }
    }
};

/**
 *  找寻父结点的tr结点
 * @param dom
 * @return {*}
 */
const findParentTr = function (dom) {
    let resDom = dom;
    while (resDom.nodeName !== 'TR'
    && resDom.nodeName !== 'BODY'){
        resDom = resDom.parentElement;
    }
    if(resDom.nodeName !== 'TR') return;
    return resDom;
};

/**
 *  对img父节点的td属性进行rowSpan
 * @param dom
 */
const rowSpanTdForImg = function(dom){
    let imgNodes = dom.getElementsByTagName('img');
    for(let i=0;i<imgNodes.length;i++){
        let imgHeight = imgNodes[i].height;
        let parentTr = findParentTr(imgNodes[i]);
        if(parentTr){
            let rowSpan = Math.ceil(imgHeight / 21);
            let childNodes = parentTr.childNodes;
            for(let i=0;i<childNodes.length;i++){
                childNodes[i].rowSpan = rowSpan;
            }
        }
    }
};

/**
 * 将块标签转换为table标签
 * @param dom
 */
const reverseBlockTagsToTable = function (dom) {
    let childNodes = dom.childNodes;
    for(let i=0;i<childNodes.length;i++){
        if(childNodes[i].nodeName === '#text' ||
            childNodes[i].getElementsByTagName('table').length > 0) continue;
        if(displayTags.indexOf(childNodes[i].nodeName)!==-1){
            let oTable = document.createElement('table');
            let oTr = document.createElement('tr');
            let curChildNodes = childNodes[i].childNodes;
            // 0. 当遇到行内标签时， 创建oTd, 将行内元素插入到oTd中，并且oTd插入到oTr;
            // 1. 当遇到块标签时， 当oTr.childNodes.length > 0, 则插入到oTable;
            //    然后创建新的oTr;
            // 2. 跳出for循环后， 若oTr.childNodes.length > 0， 则插入到oTable;
            for(let j=0;j<curChildNodes.length;j++){
                if(!curChildNodes[j].nodeName) continue;
                if(displayInlineTags.indexOf(curChildNodes[j].nodeName)!==-1){
                    let oTd = document.createElement('td');
                    oTd.appendChild(curChildNodes[j].cloneNode(true));
                    oTr.appendChild(oTd); //插入元素到容器末尾
                }
                if(displayTags.indexOf(curChildNodes[j].nodeName)!==-1){
                    if(oTr.childNodes.length > 0){
                        oTable.appendChild(oTr);
                        oTr = document.createElement('tr');
                    }
                    let oTd = document.createElement('td');
                    oTd.appendChild(curChildNodes[j].cloneNode(true));
                    oTr.appendChild(oTd);
                    oTable.appendChild(oTr);
                    oTr = document.createElement('tr');
                }
            }
            if(oTr.childNodes.length > 0){
                oTable.appendChild(oTr);
            }
            // 将新创建的table插入到原来dom中的位置
            dom.insertBefore(oTable, childNodes[i]);
            // 删除原来的dom
            dom.removeChild(childNodes[i+1]);
        }
    }
};

/**
 * 清洗html，适应xlsx
 * @param dom dom结点
 */
const dealHtmlToXLSX = function(content){
    // 替换P标签为span标签
    // content = replacePTagsToSpan(content);
    var parser = new DOMParser();
    var dom = parser.parseFromString(content, "text/html");
    // 将块标签转换为table标签
    reverseBlockTagsToTable(dom.getElementsByTagName('body')[0]);
    // 对img父节点的td属性进行rowSpan
    rowSpanTdForImg(dom.getElementsByTagName('body')[0]);
    // 获取表格td的个数
    getTdLen(dom);
    // 调整表格宽度
    convertTableWidth(dom);
    // 转化dom为string
    return {
        dom: dom,
        content: dom.childNodes[0].innerHTML
    }
};

export {
    dealHtmlToXLSX
}