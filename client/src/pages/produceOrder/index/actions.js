import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';


/**
 * 获取生产单列表数据
 **/
const fetchProduceOrderList = () => ({
    type: constant.FETCH_PRODUCE_ORDER_LIST_REQUEST
});
const fetchProduceOrderListSuccess = (data) => ({
    type: constant.FETCH_PRODUCE_ORDER_LIST_SUCCESS,
    data
});
const fetchProduceOrderListFailure = (error) => ({
    type: constant.FETCH_PRODUCE_ORDER_LIST_FAILURE,
    error
});

/**
 * 获取生产单列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchProduceOrderList = (params, callback) => dispatch => {
    dispatch(fetchProduceOrderList());

    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/produceOrder/list`, {
        params: {
            page: 1,
            ...params
        }
    }).then(function (res) {
        dispatch(fetchProduceOrderListSuccess(fromJS(res.data)));
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchProduceOrderListFailure(error));
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


export const asyncDeleteProduceOrderInfo = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/produceOrder/delete`, params).then(function (res) {
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
    axios.get(`${BASE_URL}/produceOrder/listEnter`, {params: {billNo: billNo}}).then(function (res) {
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


// 批量选择bom，返回配件
export const asyncFetchProduceFittingList =(params, callback)=>({
    actionTypePrefix: constant.FETCH_PRODUCE_FITTING_LIST,
    request: axios.post(`${BASE_URL}/produceOrder/multi/bom`, {...params}),
    callback
});


/**
 * 获取生产记录
 * @param params
 * @returns {Function}
 */
const fetchProduceRecordRequest = () => ({
    type: constant.FETCH_PRODUCE_RECORD_REQUEST
});
const fetchProduceRecordSuccess = (data) => ({
    type: constant.FETCH_PRODUCE_RECORD_SUCCESS,
    data
});
const fetchProduceRecordFailure = () => ({
    type: constant.FETCH_PRODUCE_RECORD_FAILURE
});

export const asyncFetchProduceRecord = ({recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchProduceRecordRequest());
    axios.get(`/api/produceOrder/record`,{
        params: {
            recordFor,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchProduceRecordSuccess(res.data));

        }else{
            dispatch(fetchProduceRecordFailure());
        }

        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchProduceRecordFailure(error));
    });
};
