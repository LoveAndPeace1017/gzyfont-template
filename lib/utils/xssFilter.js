const cheerio = require('cheerio');


/**
 * xssFilter 主要用于防止富文本xss攻击，过滤掉白名单以外的标签和属性
 * @params {String} html字符串
 * @return {String} 过滤过后的html字符串
 * */
const xssFilter = function(html) {
    if(!html) return '';

    const $ = cheerio.load(html);

    //白名单, 只允许下面标签和其属性
    const whiteList = {
        'html' : [''],
        'body' : [''],
        'head' : [''],
        'a' : ['style', 'href','class'],
        'b' : ['style','class'],
        'blockquote' : ['style','class'],
        'br' : ['style','class'],
        'caption' : ['style','class'],
        'cite' : ['style','class'],
        'code' : ['style','class'],
        'col' : ['style','class'],
        'colgroup': ['style','class'],
        'dd' : ['style','class'],
        'div' : ['class','class', 'id', 'contenteditable'],
        'dl' : ['style','class'],
        'dt' : ['style','class'],
        'em' : ['style','class'],
        'figure': ['class','class'],
        'h1' : ['style','class'],
        'h2' : ['style','class'],
        'h3' : ['style','class'],
        'h4' : ['style','class'],
        'h5' : ['style','class'],
        'h6' : ['style','class'],
        'i' : ['style','class'],
        'img' : ['style','class', 'src', 'align', 'alt', 'height', 'width', 'title'],
        'li' : ['style','class'],
        'n' : ['style','class'],
        'ol' : ['style','class'],
        'p' : ['style','class'],
        'pre' : ['style','class'],
        'q' : ['style','class'],
        'small' : ['style','class'],
        'span' : ['style','class'],
        'strike' : ['style','class'],
        'strong' : ['style','class'],
        'sub' : ['style','class'],
        'sup' : ['style','class'],
        'table' : ['style','class', 'id', 'border', 'width', 'cellpadding', 'cellspacing'],
        'tbody' : ['style','class'],
        'td' : ['style','class', 'id', 'contenteditable', 'colspan', 'rowspan'],
        'tfoot' : ['style','class'],
        'th' : ['style','class', 'id', 'contenteditable', 'colspan', 'rowspan'],
        'thead' : ['style','class'],
        'tr' : ['style','class'],
        'u' : ['style','class'],
        'ul' : ['style','class']
    };

    //img的src属性和a标签的href属性只允许下面这种格式开头的属性值。
    const whiteProtocolsReg= /^(http|https):\/\//;

    $('*').each(function(index,elem){
        if(!whiteList[elem.name]) {
             $(elem).remove();
            return;
        }
        for(const attr in elem.attribs) {
            if(whiteList[elem.name].indexOf(attr) === -1 ||
                ((attr === 'src' || attr === 'href') && !whiteProtocolsReg.test(elem.attribs[attr]))) {
                $(elem).attr(attr,null);
            }
        }

    });

    return $.html();
};

module.exports = xssFilter;