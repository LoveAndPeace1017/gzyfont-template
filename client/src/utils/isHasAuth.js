/**
 * 判断时候有对应的权限
 * @param authCode 后端传过来的权限值
 *
 * @param auth
 * 新增 8（二进制：1000）
 * 删除 4（二进制：100）
 * 修改 2（二进制：10）
 * 查看 1（二进制：1）
 *
 * **/


const isHasAuth = (authCode, auth) => {
    if(authCode <=0 || auth<0) return false;
    return auth == (authCode & auth);  //这边是异或操作
};


function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}


/**
 * 判断是否有权限
 * @param authMap -- 权限json数据
 * @param module --所属模块
 * @param option --对于的权限类型 add modify delete show
 * @param authCombineType --权限组合类型，仅仅才module为数组的情况下即多个权限才生效， 可选值为 '&&'(每一个都有权限才为真)、'||（只要有一个有权限则为真）'、'custom'（返回结果为一个数组[1, 0, 1]）可以根据结果自行组合判断
 * @param authAllDataRange -- 判断对应的权限模块是否需要判断数据范围为全部
 * @return authed {boolean | array<0, 1, 1, ...>}  是否有权限
 * **/
export const isAuthed = (authMap, module, option, authCombineType = '&&', authAllDataRange) =>{
    const combineType = {
        '&&': 'every',
        '||': 'some',
        'custom': 'map'
    };
    let authed;
    if(module){
        if(isArray(module)){
            authed = module[combineType[authCombineType]]((item, index) => {
                if(isArray(option)){
                    return authMap[item][option[index]]
                }else{
                    return authAllDataRange && authAllDataRange[index]?authMap[item][option] && authMap[item]['dataRange']===2: authMap[item][option];
                }
            })
        }else{
            //处理一个组件设计的系统漏洞，输入一个不存在的module类型，设置权限为true
            authed = authMap[module][option];
        }
    }else{
        authed = false;
    }
    return authed;
};


export default isHasAuth;

