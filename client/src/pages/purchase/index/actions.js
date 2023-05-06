import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

const setConfirmFetchingTrue = (data) => ({
    type: constant.PURCHASE_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.PURCHASE_CONFIRM_FETCHING_FALSE,
    error
});

const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_PURCHASE_CONFIG_SUCCESS,
    data
});

export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/purchase/config/`).then(function (res) {
        dispatch(fetchConfigSuccess(res.data));
        callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        });
    });
};

export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`${BASE_URL}/purchase/listStatistics/`).then(function (res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        });
    });
};


/**
 * 获取物品列表数据
 **/
/*const fetchPurchaseList = () => ({
    type: constant.PURCHASE_LIST
});
const fetchPurchaseListSuccess = (data) => ({
    type: constant.PURCHASE_LIST_SUCCESS,
    data
});
const fetchPurchaseListFailure = (error) => ({
    type: constant.PURCHASE_LIST_FAILURE,
    error
});*/
/**
 * 获取销售列表
 * @param params
 * @returns {Function}
 */
/*export const asyncFetchPurchaseList = (params, callback) => dispatch => {
    dispatch(fetchPurchaseList());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }

    axios.get(`${BASE_URL}/purchase/list`, {
        params: {
            page: 1,
            // perPage: 3,
            ...params
        }
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchPurchaseListSuccess(fromJS(res.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchPurchaseListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchPurchaseListFailure(error));
    });
};*/

export const asyncFetchPurchaseList = (params, callback) => {
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    return {
        actionTypePrefix: 'PURCHASE_LIST',
        request: axios.get(`${BASE_URL}/purchase/list`, {
            params: {
                page: 1,
                // perPage: 3,
                ...params
            }
        }),
        callback
    };
};

// 列表返回带回初始化数据
const filterConfigListSuccess = (data) => ({
    type: constant.FILTER_CONFIG_LIST,
    data
});

export const dealFilterConfigList = (data) => dispatch => {
    dispatch(filterConfigListSuccess(data))
};

const fetchLocalPurchaseInfo = (id) => ({
    type: constant.GET_LOCAL_PURCHASE_INFO,
    id
});

export const getLocalPurchaseInfo = (id) => dispatch => {
    dispatch(fetchLocalPurchaseInfo(id))
};

/**
 * 修改物品信息
 * @param purchase
 * @param callback
 * @returns {Function}
 */
export const asyncModifyPurchaseInfo = (purchase, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`${BASE_URL}/purchase/modify`, purchase).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(setConfirmFetchingFalse(fromJS(purchase)))
        } else {
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

/**
 * 新增物品信息
 * @param purchase
 * @param callback
 * @returns {Function}
 */
export const asyncInsertPurchaseInfo = (purchase, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`${BASE_URL}/purchase/insert`, purchase).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(setConfirmFetchingFalse(fromJS(res.data)))
        } else {
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

export const asyncDeletePurchaseInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/purchase/delete`, {
        ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
//删除之前确认下是否可以删除
export const asyncBeforeDeletePurchaseInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/purchase/beforeDelete`, {
        ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncTogglePurchaseInfo = (id, disableFlag, callback) => dispatch => {
    let url = disableFlag ? `${BASE_URL}/purchase/status/enable/${id}` : `${BASE_URL}/purchase/status/disable/${id}`;
    axios.post(url).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 更新配置项
 */
const updateConfig = (data) => ({
    type: constant.TYPE + '_' + 'COMMON_UPDATE_TEMP_CONFIG',
    data
});
export const asyncUpdateConfig = (type, fieldName, propName, index, value) => dispatch => {
    dispatch(updateConfig({
        type, fieldName, propName, index, value
    }));
};

export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);

/**
 * 根据物品code获取物品仓库数量
 **/
const fetchWareByCodeRequest = (code) => ({
    type: constant.FETCH_WARE_BY_CODE_REQUEST,
    code
});
const fetchWareByCodeSuccess = (code, data) => ({
    type: constant.FETCH_WARE_BY_CODE_SUCCESS,
    code,
    data
});
const fetchWareByCodeFailure = (code, error) => ({
    type: constant.FETCH_WARE_BY_CODE_FAILURE,
    code,
    error
});

export const asyncFetchWareByCode = (code, callback) => dispatch => {
    dispatch(fetchWareByCodeRequest(code));
    axios.get(`${BASE_URL}/purchase/${code}/inventories`).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchWareByCodeSuccess(code, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchWareByCodeFailure(code, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchWareByCodeFailure(error));
    });
};

/**
 * 取消分销物品
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncCancelDistribute = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/purchase/delete`, {
        ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
/**
 * 设置分销物品
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncSetDistribute = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/purchase/delete`, {
        ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};


/**
 * 获取采购记录
 **/
const fetchPurchaseRecordRequest = () => ({
    type: constant.FETCH_PURCHASE_RECORD_REQUEST
});
const fetchPurchaseRecordSuccess = (data) => ({
    type: constant.FETCH_PURCHASE_RECORD_SUCCESS,
    data
});
const fetchPurchaseRecordFailure = () => ({
    type: constant.FETCH_PURCHASE_RECORD_FAILURE
});
export const asyncFetchPurchaseRecord = ({recordFor, type, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchPurchaseRecordRequest());
    axios.get(`${BASE_URL}/purchase/record/for/${recordFor}`, {
        params: {
            type,
            page,
            perPage
        }
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchPurchaseRecordSuccess(res.data));
        } else {
            dispatch(fetchPurchaseRecordFailure());
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPurchaseRecordFailure(error));
    });
};

/**
 * 获取采购批量入库信息
 **/
const fetchBatchEnterInfoRequest = () => ({
    type: constant.FETCH_PURCHASE_BATCH_ENTER_INFO_REQUEST
});
const fetchBatchEnterInfoSuccess = (data) => ({
    type: constant.FETCH_PURCHASE_BATCH_ENTER_INFO_SUCCESS,
    data
});
const fetchBatchEnterInfoFailure = () => ({
    type: constant.FETCH_PURCHASE_BATCH_ENTER_INFO_FAILURE
});
export const asyncBatchEnterInfo = (ids, callback) => dispatch => {
    dispatch(fetchBatchEnterInfoRequest());
    axios.post(`${BASE_URL}/purchase/enters/batch/pre/create`, {
        ids
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchBatchEnterInfoSuccess(fromJS(res.data)));
        } else {
            dispatch(fetchBatchEnterInfoFailure());
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchBatchEnterInfoFailure(error));
    });
};

export const asyncBatchEnter = ({dataList, warehouseName}, callback) => dispatch => {
    axios.post(`${BASE_URL}/purchase/enters/batch`, {
        dataList,
        warehouseName
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 获取采购批量入库信息
 **/
const fetchBatchExpendPreInfoRequest = () => ({
    type: constant.FETCH_PURCHASE_BATCH_PRE_EXPEND_REQUEST
});
const fetchBatchExpendPreInfoSuccess = (data) => ({
    type: constant.FETCH_PURCHASE_BATCH_PRE_EXPEND_SUCCESS,
    data
});
const fetchBatchExpendPreInfoFailure = () => ({
    type: constant.FETCH_PURCHASE_BATCH_PRE_EXPEND_FAILURE
});
export const asyncBatchExpendPreInfo = (ids, callback) => dispatch => {
    dispatch(fetchBatchExpendPreInfoRequest());
    axios.post(`${BASE_URL}/purchase/payments/batch/pre/create`, {
        ids
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchBatchExpendPreInfoSuccess(fromJS(res.data)));
        } else {
            dispatch(fetchBatchExpendPreInfoFailure());
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchBatchExpendPreInfoFailure(error));
    });
};

export const asyncBatchExpend = (dataList, callback) => dispatch => {
    axios.post(`${BASE_URL}/purchase/payments/batch`, {
        dataList
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 获取采购批量到票信息
 **/
const fetchBatchInvoiceInfoRequest = () => ({
    type: constant.FETCH_PURCHASE_BATCH_PRE_INVOICE_REQUEST
});
const fetchBatchInvoiceInfoSuccess = (data) => ({
    type: constant.FETCH_PURCHASE_BATCH_PRE_INVOICE_SUCCESS,
    data
});
const fetchBatchInvoiceInfoFailure = () => ({
    type: constant.FETCH_PURCHASE_BATCH_PRE_INVOICE_FAILURE
});
export const asyncBatchInvoiceInfo = (ids, callback) => dispatch => {
    dispatch(fetchBatchInvoiceInfoRequest());
    axios.post(`${BASE_URL}/purchase/invoices/batch/pre/create`, {
        ids
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchBatchInvoiceInfoSuccess(fromJS(res.data)));
        } else {
            dispatch(fetchBatchInvoiceInfoFailure());
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchBatchInvoiceInfoFailure(error));
    });
};

export const asyncBatchInvoice = (dataList, callback) => dispatch => {
    axios.post(`${BASE_URL}/purchase/invoices/batch`, {
        dataList
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 根据单号获取物品概要的总类
 **/
const fetchProdAbstractByBillNoRequest = (billNo) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_REQUEST,
    billNo
});
const fetchProdAbstractByBillNoSuccess = (billNo, data) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_SUCCESS,
    billNo,
    data
});
const fetchProdAbstractByBillNoFailure = (billNo, error) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_FAILURE,
    billNo,
    error
});

export const asyncFetchProdAbstractByBillNo = (billNo, callback) => dispatch => {
    dispatch(fetchProdAbstractByBillNoRequest(billNo));
    axios.get(`${BASE_URL}/purchase/listProd`, {params: {billNo: billNo}}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchProdAbstractByBillNoSuccess(billNo, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchProdAbstractByBillNoFailure(billNo, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchProdAbstractByBillNoFailure(error));
    });
};

//批量审批&反审
export const asyncBatchApproved = ({type, ...params}, callback) => dispatch => {
    // type 0 审批  1 反审
    let uri = (type == 0) ? `${BASE_URL}/purchase/approve/list` : `${BASE_URL}/purchase/approve/counter/list`;
    axios.post(uri, params).then(function(res) {
        if(res.data){
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
