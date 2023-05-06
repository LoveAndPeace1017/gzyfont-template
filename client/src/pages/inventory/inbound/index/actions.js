import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

const setConfirmFetchingTrue = (data) => ({
    type: constant.INBOUND_ORDER_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.INBOUND_ORDER_CONFIRM_FETCHING_FALSE,
    error
});


export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`/api/inventory/in/listStatistics/`).then(function(res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode:1,
            retMsg:error
        });
    });
};


/**
 * 获取仓库列表数据
 **/
const fetchInboundOrderList = () => ({
    type: constant.INBOUND_ORDER_LIST
});
const fetchInboundOrderListSuccess = (data) => ({
    type: constant.INBOUND_ORDER_LIST_SUCCESS,
    data
});
const fetchInboundOrderListFailure = (error) => ({
    type: constant.INBOUND_ORDER_LIST_FAILURE,
    error
});
/**
 * 获取入库列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchInboundOrderList = (params,callback) => dispatch => {
    dispatch(fetchInboundOrderList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/inventory/in/list`, {params}).then(res => {
        if (res.data && res.data.retCode=== 0) {
            dispatch(fetchInboundOrderListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }else{
            dispatch(fetchInboundOrderListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchInboundOrderListFailure(error));
    })
};

// 列表返回带回初始化数据
const filterConfigListSuccess = (data) => ({
    type: constant.FILTER_CONFIG_LIST,
    data
});

export const dealFilterConfigList = (data) => dispatch => {
    dispatch(filterConfigListSuccess(data))
};

const fetchLocalInboundOrderInfo = (id) => ({
    type: constant.GET_LOCAL_INBOUND_ORDER_INFO,
    id
});

export const getLocalInboundOrderInfo = (id) => dispatch => {
    dispatch(fetchLocalInboundOrderInfo(id))
};

/**
 * 修改仓库信息
 * @param inventory/in
 * @param callback
 * @returns {Function}
 */
export const asyncModifyInboundOrderInfo = (order,callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`/api/inventory/in/modify`,order).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(order)))
        }else{
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

/**
 * 新增仓库信息
 * @param inventory/in
 * @param callback
 * @returns {Function}
 */
export const asyncInsertInboundOrderInfo = (order, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`/api/inventory/in/insert`,order).then(function(res) {
        if (res.data && res.data.retCode==0) {

            dispatch(setConfirmFetchingFalse(fromJS(res.data)))
        }else{
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

export const asyncDeleteInboundOrderInfo = (ids, callback) => dispatch => {
    axios.post(`/api/inventory/in/delete`,{
        ids:ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
export const asyncToggleInboundOrderInfo = (id, disableFlag, callback) => dispatch => {
    axios.post(`/api/inventory/in/disable/${id}`,{
        disableFlag
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 获取入库记录
 **/
const fetchInboundRecordRequest = () => ({
    type: constant.FETCH_INBOUND_RECORD_REQUEST
});
const fetchInboundRecordSuccess = (data) => ({
    type: constant.FETCH_INBOUND_RECORD_SUCCESS,
    data
});
const fetchInboundRecordFailure = () => ({
    type: constant.FETCH_INBOUND_RECORD_FAILURE
});
export const asyncFetchInboundRecord = ({recordFor, type, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchInboundRecordRequest());
    axios.get(`${BASE_URL}/inventory/in/record/for/${recordFor}`,{
        params: {
            type,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchInboundRecordSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchInboundRecordFailure());
        }
    }).catch(error => {
        dispatch(fetchInboundRecordFailure(error));
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
    axios.get(`${BASE_URL}/inventory/in/listEnter`, {params: {billNo: billNo}}).then(function (res) {
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
//批量审核
export const asyncBatchApproved = (billNo, callback) => dispatch => {
    axios.post(`${BASE_URL}/inventory/in/approve/list`, {billNoArray:billNo}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
          callback && callback(res);
        } else {
          alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};
//批量反审
export const asyncBatchUnApproved = (billNo, callback) => dispatch => {
    axios.post(`${BASE_URL}/inventory/in/approve/counter/list`, {billNoArray:billNo}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            callback && callback(res);
        } else {
            alert(res.data.retMsg);
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
export const asyncUpdateConfig = (type, fieldName,propName,index,value) => dispatch => {
    dispatch(updateConfig({
        type, fieldName,propName,index,value
    }));
};
export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);





