import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';


const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_SUBCONTRACT_CONFIG_SUCCESS,
    data
});

export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/goods/config/`).then(function (res) {
        dispatch(fetchConfigSuccess(res.data));
        callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        });
    });
};

/**
 * 获取委外加工列表数据
 **/
const fetchSubcontractList = () => ({
    type: constant.FETCH_SUBCONTRACT_LIST_REQUEST
});
const fetchSubcontractListSuccess = (data) => ({
    type: constant.FETCH_SUBCONTRACT_LIST_SUCCESS,
    data
});
const fetchSubcontractListFailure = (error) => ({
    type: constant.FETCH_SUBCONTRACT_LIST_FAILURE,
    error
});

/**
 * 获取委外加工列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchSubcontractList = (params, callback) => dispatch => {

    dispatch(fetchSubcontractList());

    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/subcontract/list`, {
        params: {
            page: 1,
            ...params
        }
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchSubcontractListSuccess(fromJS(res.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchSubcontractListFailure(fromJS(res.data)));
        }
    }).catch(error => {
        dispatch(fetchSubcontractListFailure(error));
    });
};


/**
 * 根据单号获取物品概要的总类
 **/
const fetchProdAbstractByBillNoRequest = (billNo) => ({
    type: constant.FETCH_OUTSOURCE_PROD_ABSTRACT_BY_BILL_NO_REQUEST,
    billNo
});
const fetchProdAbstractByBillNoSuccess = (billNo, data) => ({
    type: constant.FETCH_OUTSOURCE_PROD_ABSTRACT_BY_BILL_NO_SUCCESS,
    billNo,
    data
});
const fetchProdAbstractByBillNoFailure = (billNo, error) => ({
    type: constant.FETCH_OUTSOURCE_PROD_ABSTRACT_BY_BILL_NO_FAILURE,
    billNo,
    error
});


export const asyncFetchProdAbstractByBillNo = (billNo, callback) => dispatch => {
    dispatch(fetchProdAbstractByBillNoRequest(billNo));
    axios.get(`${BASE_URL}/subcontract/listCheck`, {params: {billNo: billNo}}).then(function (res) {
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

// 列表返回带回初始化数据
const filterConfigListSuccess = (data) => ({
    type: constant.FILTER_CONFIG_LIST,
    data
});

export const dealFilterConfigList = (data) => dispatch => {
    dispatch(filterConfigListSuccess(data))
};


export const asyncDeleteSubcontractInfo = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/subcontract/delete`, params).then(function (res) {
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