import React, { Component } from 'react';
import IntlTranslation from 'utils/IntlTranslation';
import approveImg0 from 'images/approve/approveImg0.png';
import approveImg1 from 'images/approve/approveImg1.png';
import approveImg2 from 'images/approve/approveImg2.png';
import approveImg3 from 'images/approve/approveImg3.png';
import en_approveImg0 from 'images/approve/en_approveImg0.png';
import en_approveImg1 from 'images/approve/en_approveImg1.png';
import en_approveImg2 from 'images/approve/en_approveImg2.png';
import en_approveImg3 from 'images/approve/en_approveImg3.png';


/***
 *   审批人  :  A
    发起人  :  B
   普通人 ： C
  发起人&审批人 D
 注： 会签审批中 如果a, b 都是审批人， a审批通过， b不通过  则将a看做身份C

      通过  驳回   提交  撤回
 审批开启 但没选择审批流程  0
 A： 隐藏  隐藏  显示  隐藏
 B： 隐藏  隐藏  显示  隐藏
 C： 隐藏  隐藏  显示  隐藏
 D:  隐藏  隐藏  显示  隐藏

 审批通过  1
 A： 隐藏  隐藏  隐藏  隐藏
 B： 隐藏  隐藏  隐藏  显示
 C： 隐藏  隐藏  隐藏  隐藏
 D:  隐藏  隐藏  隐藏  显示

 驳回   2
 A： 隐藏  隐藏  隐藏  隐藏
 B： 隐藏  隐藏  显示  显示
 C： 隐藏  隐藏  隐藏  隐藏
 D:  隐藏  隐藏  显示  显示

 审批中  3
 A： 显示  显示   隐藏   隐藏
 B： 隐藏  隐藏  隐藏  显示
 C： 隐藏  隐藏  隐藏  隐藏
 D:  显示  显示  隐藏  显示

 审批权未开启  999
 A： 隐藏  隐藏   隐藏   隐藏
 B： 隐藏  隐藏  隐藏  隐藏
 C： 隐藏  隐藏  隐藏  隐藏
 D:  隐藏  隐藏  隐藏  隐藏
 */

/**
 *   approveStatus  审批状态 0 未提交  1 通过  2 反驳  3 审批中
 */
const approveBtnGroup = {
    0: {
        A: {approvePass: false, approveReject: false, approveSubmit: true, approveRevert: false},
        B: {approvePass: false, approveReject: false, approveSubmit: true, approveRevert: false},
        C: {approvePass: false, approveReject: false, approveSubmit: true, approveRevert: false},
        D: {approvePass: false, approveReject: false, approveSubmit: true, approveRevert: false}
    },
    1: {
        A: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        B: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: true},
        C: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        D: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: true}
    },
    2: {
        A: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        B: {approvePass: false, approveReject: false, approveSubmit: true, approveRevert: true},
        C: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        D: {approvePass: false, approveReject: false, approveSubmit: true, approveRevert: true}
    },
    3: {
        A: {approvePass: true, approveReject: true, approveSubmit: false, approveRevert: false},
        B: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: true},
        C: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        D: {approvePass: true, approveReject: true, approveSubmit: false, approveRevert: true}
    },
    999: {
        A: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        B: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        C: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false},
        D: {approvePass: false, approveReject: false, approveSubmit: false, approveRevert: false}
    }
};

//            0 未通过      1 通过      2 反驳        3 审批中      999 当前模块未开通审批
// 如 入库        不可用(0)    可用(1)     不可用(0)    不可用(0)      可用(1)
const commonBtnGroup = {
    inboundApproveDisabled: {0: false, 1:  true, 2: false, 3: false, 999: true}, // 入库
    invoiceApproveDisabled: {0: false, 1:  true, 2: false, 3: false, 999: true}, // 到票
    mergeInvoiceApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true}, // 合并到票
    expendApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true}, //付款
    mergeExpendApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true}, //合并付款
    outboundApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true}, // 出库
    saleInvoiceApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true}, //  开票
    mergeSaleInvoiceApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true},  // 合并开票
    incomeApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true}, // 收款
    mergeIncomeApproveDisabled: {0: false, 1: true, 2: false, 3: false,999: true}, // 合并收款
    modifyApproveDisabled: {0: true, 1: false, 2: true, 3: false,999: true}, // 修改
    deleteApproveDisabled: {0: true, 1: false, 2: true, 3: false,999: true}, // 删除
    copyApproveDisabled: {0: true, 1: true, 2: true, 3: true,999: true},  // 复制
    exportApproveDisabled: {0: true, 1: true, 2: true, 3: true,999: true},  // 导出
    printApproveDisabled: {0: true, 1: true, 2: true, 3: true,999: true},  // 打印
    operateLogApproveDisabled: {0: true, 1: true, 2: true, 3: true,999: false},  // 操作日志
    lackMaterialApproveDisabled: {0: true, 1: true, 2: true, 3: true,999: true}, // 缺料查询
    outboundDetailApproveDisabled: {0: true, 1: true, 2: true, 3: true,999: true},  // 出库（入库单详情）
    requisitionPurchaseApproveDisabled: {0:false, 1:true, 2:false, 3:false, 999:true}, //请购单采购按钮
    requisitionOutWareApproveDisabled: {0:false, 1:true, 2:false, 3:false, 999:true}, //请购单出库按钮
    refundApproveDisabled: {0:false, 1:true, 2:false, 3:false, 999:true},  // 退货按钮
};

/**
 *   撤回状态对应的按钮状态
 *   approveStatus  审批状态 0 未提交  1 通过  2 反驳  3 审批中  999 当前模块未开通审批
 */
const revertBtnGroup = {
    0: false,
    1: true,
    2: true,
    3: true,
    999: false
};

/**
 *  当不符合审批条件时，需要隐藏而不是不可以点击
 * @type {string[]}
 */
const HIDDEN_MODULE_KEYS = ['operateLogApproveDisabled', 'approvePass', 'approveReject', 'approveSubmit', 'approveRevert'];

/**
 * @type {string[]}
 * approvePass  审批通过
 * approveReject  审批驳回
 * approveSubmit  提交
 * approveRevert  撤回
 * 这些按钮需要特殊处理，其显示和隐藏与  approveStatus 和用户当前的身份有关
 */
const APPROVE_MODULE_KEYS = ['approvePass', 'approveReject', 'approveSubmit', 'approveRevert'];

/***
 *
 * @param isCreator
 * @param isAssignee
 * @returns {string}
 * @constructor
 * @return
 * 审批人  :  A
 * 发起人 :  B
 * 普通人 ： C
 * 发起人&审批人 D
 */
const _backABC = (isCreator, isAssignee) => {
    let res = 'C';
    if(isAssignee && isCreator){
        res = 'D';
    } else if(isAssignee){
        res = 'A';
    } else if(isCreator){
        res = 'B';
    }
    console.log(res, '身份');
    return res;
};


/**
 * @param  operateType  当前的操作名称
 * @param approveModuleFlag 当前模块的审批功能是否开启 0 未开启  1 开启
 * @param approveStatus  当前审批状态
 * @param isCreator  是否为发起人
 * @param isAssignee  是否为审核人
 * @param approveCancel 布尔类型，表示是否有撤回权限
 * approveStatus   0 未提交 1 通过  2 反驳  3 审批中  999 当前模块未开通审批
 * 注： 会签审批中 如果a, b 都是审批人， a审批通过， b不通过  则将a看做身份C
 * @constructor
 * @return boolean 当前按钮的显示或隐藏
 */
export const backDisabledStatus = (operateType, approveModuleFlag, approveStatus, isCreator, isAssignee, approveCancel = false) => {
    approveStatus = approveStatus || 0;
    if(approveModuleFlag===0){
        approveStatus = 999;
    }
    if(APPROVE_MODULE_KEYS.indexOf(operateType)!==-1){  // 审批通过 审批驳回 提交 撤回
        if(operateType === 'approveRevert'){ // 撤回按钮
            if(approveCancel){
                return revertBtnGroup[approveStatus];
            }
            return false; // 如果没有撤回权限， 撤回权限置为false
        }
        let alph = _backABC(isCreator, isAssignee);
        return approveBtnGroup[approveStatus][alph][operateType];
    } else {
        return commonBtnGroup[operateType][approveStatus];
    }
};

/**
 *  各个单据列表页面使用  如销售新增页面
 * @param approveModuleFlag 当前模块的审批功能是否开启 0 未开启  1 开启
 * @param selectedRows  当前选中的行
 * @param checkFnc  过滤的具体方法
 */
export const batchBackDisabledStatusForList = (approveModuleFlag, selectedRows, checkFnc) => {
    let res = {};
    if(!selectedRows || selectedRows.length === 0){
        return res;
    }
    let keysGroup = Object.keys(commonBtnGroup).concat(APPROVE_MODULE_KEYS);
    keysGroup.map(key=>{
        res[key] = selectedRows.every(item => {
            let {approveStatus, isCreator, isAssignee} = item;
            return checkFnc(key, approveModuleFlag, approveStatus, isCreator, isAssignee) === true;
        });
    });
    return res;
};

/**
 *  各个单据详情页面使用  如销售详情页面
 * @param list
 * @param checkFnc
 */
export const batchBackDisabledStatusForDetail = (list, checkFnc) => {
    let res = {
        disabledGroup: {}, // 禁止点击
        hiddenGroup: {}  // 隐藏
    };
    /**
     *  approveModuleFlag 是否开启审批功能 0 无 1 有
     *  approveStatus  审批状态 0 未提交  1 通过  2 反驳  3 审批中
     *  isCreator  是否为发起人
     *  isAssignee  是否为审核人
     *  approveCancel  布尔类型，表示是否有撤回权限
     */
    let {approveModuleFlag, approveStatus, isCreator, isAssignee, approveCancel} = list;
    let keysGroup = Object.keys(commonBtnGroup).concat(APPROVE_MODULE_KEYS);
    keysGroup.map(key=>{
        let approveFlag = checkFnc(key, approveModuleFlag, approveStatus, isCreator, isAssignee, approveCancel);
        res.disabledGroup[key] = approveFlag;
        if(HIDDEN_MODULE_KEYS.indexOf(key)!==-1){
            res.hiddenGroup[key] = approveFlag;
        }
    });
    return res;
};


const IMG_URL = {
    approveImg0: approveImg0,
    approveImg1: approveImg1,
    approveImg2: approveImg2,
    approveImg3: approveImg3,
    en_approveImg0: en_approveImg0,
    en_approveImg1: en_approveImg1,
    en_approveImg2: en_approveImg2,
    en_approveImg3: en_approveImg3,
};
/**
 *  返回当前审批状态对应的图片
 * @param approveStatus  审批状态 0 未提交  1 通过  2 反驳  3 审批中
 * @param picFlag 当前的语言如果是英文 为yes
 * 返回结果如 中文 approveImg_0  英文 en_approveImg_0
 */
export const backApproveStatusImg = function (approveStatus, picFlag) {
    let res = 'approveImg';
    if(picFlag==='yes'){
        res = 'en_'+ res;
    }
    let key = res+approveStatus;
    return IMG_URL[key];
};


/**
 *  列表页面审批字段 各状态的对应颜色
 * @type {{"0": {label: *, color: string}, "1": {label: *, color: string}, "2": {label: *, color: string}, "3": {label: *, color: string}}}
 * 审批状态 0 未提交  1 通过  2 反驳  3 审批中
 */
export const APPROVE_COLOR_GROUP = {
    0: {label: <IntlTranslation intlKey="components.approve.approveStatus_0"/>, color: '#333'},
    1: {label: <IntlTranslation intlKey="components.approve.approveStatus_1"/>, color: '#2DA66A'},
    2: {label: <IntlTranslation intlKey="components.approve.approveStatus_2"/>, color: '#E53E3E'},
    3: {label: <IntlTranslation intlKey="components.approve.approveStatus_3"/>, color: '#FF6D1E'}
};


/**
 *  获取当前单据的审批权
 *  types 所对应的后端映射
 */
export const BACKEND_TYPES = {
    purchase: 10,  // 采购订单
    sale: 11,  // 销售订单
    inbound: 12, // 入库单
    outbound: 13, // 出库单
    income: 14, // 收入记录
    expend: 15, // 支出记录
    saleInvoice: 16, // 开票记录
    invoice: 17,  // 到票记录
    requisition: 18 //请购单
};


const permitOperateGroup = {
    purchase: ['inboundApproveEnabled', 'invoiceApproveEnabled', 'expendApproveEnabled'],
    sale: ['outboundApproveEnabled', 'saleInvoiceApproveEnabled', 'incomeApproveEnabled']
};
/**
 *  允许直接进行审批操作
 *  module 模块名称
 *  data  后端返回的数据
 */
export const batchPermitOperate = (module, data) => {
    let operateValue, result = {};
    if(!module || !data) return null;
    for(let i = 0; i < data.length; i++){
        let currentMap = data[i];
        if(!!currentMap.current){
            operateValue = currentMap.form*1;
            break;
        }
    }
    if(!operateValue) return null;
    let permitOperateArr = permitOperateGroup[module];
    for (let i = 0; i < permitOperateArr.length; i++) {
        if(operateValue>0){
            result[permitOperateArr[i]] = !!(operateValue & 1);
            operateValue = operateValue >> 1;
        } else {
            result[permitOperateArr[i]] = false;
        }
    }
    return result;
};
