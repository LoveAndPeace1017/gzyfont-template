// MRP运算-1、生产单-2、生产工单-4
export const VIP_MODULE = {
    productManage: [
        {value: 1, name: 'MRP运算'},
        {value: 2, name: '生产单'},
        {value: 4, name: '生产工单'}
    ]
};

export const getVipModule = (source, vipModuleSum) => {
    let moduleArr = [];
    let vipModule = VIP_MODULE[source];
    for (let i = 0; i < vipModule.length; i++) {
        (vipModuleSum & vipModule[i].value) && moduleArr.push(vipModule[i]);
    }
    return moduleArr;
};

export const checkVipModule = (source, vipModuleSum, moduleVal) => {
    let moduleArr = getVipModule(source, vipModuleSum);
    return moduleArr.filter(module =>
        module.value === moduleVal).length > 0;
};
