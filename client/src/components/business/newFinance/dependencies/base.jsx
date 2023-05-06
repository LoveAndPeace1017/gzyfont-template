import React, {Component} from 'react';

export default class Base extends Component {
    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 0},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 24},
        }
    };

    static SOURCE_MAP = {
        'income': {
            orderPopPayAmountKey: 'payAmount', // 弹层中payAmount字段对应的列表中对应的字段
            orderPopAmountKey: 'waitPay',  // 弹层中amount字段对应的列表中对应的字段
        },
        'expend': {
            orderPopPayAmountKey: 'payAmount', // 弹层中payAmount字段对应的列表中对应的字段
            orderPopAmountKey: 'waitPay',  // 弹层中amount字段对应的列表中对应的字段
        },
        'invoice': {
            orderPopPayAmountKey: 'invoiceAmount', // 弹层中payAmount字段对应的列表中对应的字段
            orderPopAmountKey: 'waitInvoiceAmount',  // 弹层中amount字段对应的列表中对应的字段
        },
        'saleInvoice': {
            orderPopPayAmountKey: 'invoiceAmount', // 弹层中payAmount字段对应的列表中对应的字段
            orderPopAmountKey: 'waitInvoiceAmount',  // 弹层中amount字段对应的列表中对应的字段
        },
    };

    /** 判断当前所填写的值为空 */
    static isEmpty = (val) => {
        return val!==0 && !val;
    };

    /** 判断当前所填写的值不为空 */
    static isNotEmpty = (val) => {
        return val===0 || !(val===undefined || val===null || val==='');
    };

    closeModal = (tag) => {
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };
    openModal = (tag) => {
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    render() {
        return null
    }

}





