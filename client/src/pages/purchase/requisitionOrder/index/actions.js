import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';


/**
 * 获取请购单列表数据
 **/
const fetchRequisitionOrderList = () => ({
    type: constant.FETCH_REQUISITION_ORDER_LIST_REQUEST
});
const fetchRequisitionOrderListSuccess = (data) => ({
    type: constant.FETCH_REQUISITION_ORDER_LIST_SUCCESS,
    data
});
const fetchRequisitionOrderListFailure = (error) => ({
    type: constant.FETCH_REQUISITION_ORDER_LIST_FAILURE,
    error
});

/**
 * 获取请购单列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchRequisitionOrderList = (params, callback) => dispatch => {
    dispatch(fetchRequisitionOrderList());

    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/requisitionOrder/list`, {
        params: {
            page: 1,
            ...params
        }
    }).then(function (res) {
        dispatch(fetchRequisitionOrderListSuccess(fromJS(res.data)));
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchRequisitionOrderListFailure(error));
    });
};


// 列表返回带回初始化数据
const filterConfigListSuccess = (data) => ({
    type: constant.FILTER_CONFIG_LIST,
    data
});

export const dealFilterConfigList = (data) => dispatch => {
    dispatch(filterConfigListSuccess(data))
};


/**
 * 删除请购单
 * @param params
 */
export const asyncDeleteRequisitionOrderInfo = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/requisitionOrder/delete`, params).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 删除请购单前的校验
 * @param params
 */
export const asyncPreDeleteRequisitionOrderInfo = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/requisitionOrder/pre/delete`, params).then(function (res) {
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
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_REQUEST,
    billNo
});
const fetchProdAbstractByBillNoSuccess = (billNo, data) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_SUCCESS,
    billNo,
    data
});
const fetchProdAbstractByBillNoFailure = (billNo, error) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_FAILURE,
    billNo,
    error
});

export const asyncFetchProdAbstractByBillNo = (billNo, callback) => dispatch => {
    dispatch(fetchProdAbstractByBillNoRequest(billNo));
    axios.get(`${BASE_URL}/requisitionOrder/listEnter`, {params: {billNo: billNo}}).then(function (res) {
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



