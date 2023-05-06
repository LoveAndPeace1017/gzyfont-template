/**
 * Created by qiumingsheng
 */

/**
 * 获取url中的参数
 * @param name
 * @returns {string}
 */
export const getUrlParamValue = (name)=>{
    let reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
    //console.log(location.search,'location.search');

    let r =  location.search.substr(1).match(reg);
    console.log(location.search,'location.search',r);
    let strValue = "";
    if (r!=null){
        strValue= decodeURIComponent(r[2]);
    }
    return strValue;
};

// 序列化url参数
export const serialize = (params)=>{
    let ret = '';
    if (params) {
        let keys = Object.keys(params);
        keys.forEach(function(key, index) {
            let value = params[key];
            if (value === undefined) {
                value = '';
            }
            ret += key + '=' + value;
            if (index < keys.length - 1) {
                ret += '&';
            }
        });
    }
    return ret;
};

// 序列化url参数
export const serializeUrl = (url, params)=>{
    let query = serialize(params);
    if(!query)
        return url;

    if(url.indexOf('?')!==-1){
        url = url + '&' +query;
    }else{
        url = url + '?' +query;
    }
    return url;
};

