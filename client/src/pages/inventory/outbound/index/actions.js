import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`/api/inventory/out/listStatistics/`).then(function(res) {
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
const fetchOutboundOrderList = () => ({
    type: constant.OUTBOUND_ORDER_LIST
});
const fetchOutboundOrderListSuccess = (data) => ({
    type: constant.OUTBOUND_ORDER_LIST_SUCCESS,
    data
});
const fetchOutboundOrderListFailure = (error) => ({
    type: constant.OUTBOUND_ORDER_LIST_FAILURE,
    error
});

const asyncOperationLogSuccess = (data) => ({
    type: constant.ASYNC_OPERATION_LOGS_SUCCESS,
    data
});

/**
 * 获取出库单列表
 * @param params
 * @param callback
 * @returns {Function}
 */
export const asyncFetchOutboundOrderList = (params, callback) => dispatch => {
    dispatch(fetchOutboundOrderList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/inventory/out/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchOutboundOrderListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchOutboundOrderListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchOutboundOrderListFailure(error));
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

export const asyncDeleteOutboundOrderInfo = (ids, callback) => dispatch => {
    axios.post(`/api/inventory/out/delete`,{
        ids:ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
export const asyncToggleOutboundOrderInfo = (id, disableFlag, callback) => dispatch => {
    axios.post(`/api/inventory/out/disable/${id}`,{
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

/**
 * 获取出库记录
 **/
const fetchOutboundRecordRequest = () => ({
    type: constant.FETCH_OUTBOUND_RECORD_REQUEST
});
const fetchOutboundRecordSuccess = (data) => ({
    type: constant.FETCH_OUTBOUND_RECORD_SUCCESS,
    data
});
const fetchOutboundRecordFailure = () => ({
    type: constant.FETCH_OUTBOUND_RECORD_FAILURE
});
export const asyncFetchOutboundRecord = ({recordFor, type, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchOutboundRecordRequest());
    axios.get(`${BASE_URL}/inventory/out/record/for/${recordFor}`,{
        params: {
            type,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchOutboundRecordSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchOutboundRecordFailure());
        }
    }).catch(error => {
        dispatch(fetchOutboundRecordFailure(error));
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
    axios.get(`${BASE_URL}/inventory/out/listOut`, {params: {billNo: billNo}}).then(function (res) {
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

//反审批操作
export const asyncUnApproved = (billNo, callback) => dispatch => {
    axios.post(`${BASE_URL}/inventory/out/approve/counter/single`,{billNo:billNo}).then(function(res) {
        console.log('resData',res.data);
        if(res.data.retCode === "0"){
            //操作成功重新载入页面
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

//审批操作
export const asyncApproved = (billNo, updatedTime,callback) => dispatch => {
    axios.post(`${BASE_URL}/inventory/out/approve/single`,{billNo:billNo,updatedTime:updatedTime}).then(function(res) {
        if(res.data.retCode === "0"){
            console.log('resData',res.data);
            //操作成功重新载入页面
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

//审批操作日志
export const asyncOperationLog = (billNo, callback) => dispatch => {
    axios.get(`${BASE_URL}/inventory/out/approve/log/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            let { logWarehouseOutList } = res.data;
            console.log(logWarehouseOutList, 'logWarehouseOutList')
            dispatch(asyncOperationLogSuccess(fromJS(logWarehouseOutList)));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

//批量审核
export const asyncBatchApproved = (billNo, callback) => dispatch => {
    axios.post(`${BASE_URL}/inventory/out/approve/list`, {billNoArray:billNo}).then(function (res) {
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
    axios.post(`${BASE_URL}/inventory/out/approve/counter/list`, {billNoArray:billNo}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            callback && callback(res);
        } else {
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};



