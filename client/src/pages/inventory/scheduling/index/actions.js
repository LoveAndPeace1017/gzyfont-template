import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

const setConfirmFetchingTrue = (data) => ({
    type: constant.SCHEDULING_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.SCHEDULING_CONFIRM_FETCHING_FALSE,
    error
});

const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_SCHEDULING_CONFIG_SUCCESS,
    data
});

export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/inventory/scheduling/config/`).then(function(res) {
        dispatch(fetchConfigSuccess(res.data));
        callback(res);
    }).catch(error => {
        callback({
            retCode:1,
            retMsg:error
        });
    });
};

export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`/api/inventory/scheduling/listStatistics/`).then(function(res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode:1,
            retMsg:error
        });
    });
};


/**
 * 获取客户列表数据
 **/
const fetchSchedulingList = () => ({
    type: constant.SCHEDULING_LIST
});
const fetchSchedulingListSuccess = (data) => ({
    type: constant.SCHEDULING_LIST_SUCCESS,
    data
});
const fetchSchedulingListFailure = (error) => ({
    type: constant.SCHEDULING_LIST_FAILURE,
    error
});
/**
 * 获取客户列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchSchedulingList = (params,callback) => dispatch => {
    dispatch(fetchSchedulingList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/inventory/scheduling/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSchedulingListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchSchedulingListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchSchedulingListFailure(error));
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
 * 删除调拨单信息
 * @param billNos
 * @param callback
 * @returns {Function}
 */
export const asyncDeleteSchedulingInfo = (params, callback) => dispatch => {
    axios.post(`/api/inventory/scheduling/delete`,params).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
/**
 * 显示或隐藏客户信息
 * @param id
 * @param callback
 * @returns {Function}
 */
export const asyncToggleSchedulingInfo = (id,disableFlag, callback) => dispatch => {
    axios.post(`/api/inventory/scheduling/disable/${id}`,{
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
/**
 * 批量更新配置项
 */
export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);


/**
 * 客户联想选择
 **/
export const fetchSchedulingByValRequest = () => ({
    type: constant.FETCH_SCHEDULING_BY_VAL_REQUEST
});

export const fetchSchedulingByValSuccess = (data) => ({
    type: constant.FETCH_SCHEDULING_BY_VAL_SUCCESS,
    data
});

export const fetchSchedulingByValFailure = (error) => ({
    type: constant.FETCH_SCHEDULING_BY_VAL_FAILURE,
    error
});


let timeout;
let currentValue;
export const asyncFetchSchedulingByVal = (value, callback) => dispatch => {

    dispatch(fetchSchedulingByValRequest());

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake(){
        axios.get(`${BASE_URL}/inventory/scheduling/search/by/name/`, {
            params: {
                key: value,
                searchType:'like'
            }
        }).then(function(res) {
            if (res.data) {
                dispatch(fetchSchedulingByValSuccess(fromJS(res.data)));
                callback && callback(fromJS(res.data.data));
            }
        }).catch(error => {
            dispatch(fetchSchedulingByValFailure(error));
        });
    }

    timeout = setTimeout(fake, 300);

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
    axios.get(`${BASE_URL}/inventory/scheduling/listAllot`, {params: {billNo: billNo}}).then(function (res) {
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



