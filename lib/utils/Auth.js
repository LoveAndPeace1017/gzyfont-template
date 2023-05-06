const extend = require('extend');

let Auth = function(){

};

const authMap = {
    '01': {key: 'goods', name: '物品'},
    '02': {key: 'supplier', name: '供应商'},
    '03': {key: 'customer', name: '客户'},
    '04': {key: 'inquiry', name: '询价'},
    '05': {key: 'purchase', name: '采购'},
    '06': {key: 'sale', name: '销售'},
    '07': {key: 'inbound', name: '入库'},
    '08': {key: 'outbound', name: '出库'},
    '09': {key: 'stocktaking', name: '盘点'},
    '10': {key: 'report', name: '报表'},
    '12': {key: 'salePrice', name: '销售价'},
    '13': {key: 'purchasePrice', name: '采购价'},
    '14': {key: 'scheduling', name: '调拨'},
    '16': {key: 'expend', name: '支出'},
    '17': {key: 'invoice', name: '到票'},
    '18': {key: 'income', name: '收入'},
    '19': {key: 'saleInvoice', name: '开票'},
    '20': {key: 'bom', name: '多级bom'},
    '22': {key: 'productManage', name: '工单'},
    '23': {key: 'productOrder', name: '生产单'},
    '24': {key: 'requisition', name: '请购单'},
    '25': {key: 'quotation', name: '报价单'}
};
const userOptions = ['appendix','approve','add', 'delete', 'modify', 'show'];

extend(Auth, {
    dealAuthority(authority) {
        let map = {};
        authority && authority.forEach(function(authority) {
            let temp = authMap[authority.module];
            if (!temp) {
                return;
            }
            let authorityValue = authority.authority;
            for (let i = 5; i >= 0; i--) {
                temp[userOptions[i]] = authorityValue & 1;
                if (i == 0) {
                    temp.copy = authorityValue & 1;
                }
                authorityValue = authorityValue >> 1;
            }
            temp.dataRange = authority.dataRange;
            map[temp.key] = temp;
        });
        return map;
    }
});
module.exports = Auth;