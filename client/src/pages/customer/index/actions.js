import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

const setConfirmFetchingTrue = (data) => ({
    type: constant.CUSTOMER_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.CUSTOMER_CONFIRM_FETCHING_FALSE,
    error
});

const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_CUSTOMER_CONFIG_SUCCESS,
    data
});



export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/customer/config/`).then(function(res) {
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
    axios.get(`/api/customer/listStatistics/`).then(function(res) {
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
const fetchCustomerList = () => ({
    type: constant.CUSTOMER_LIST
});
export const fetchCustomerListSuccess = (data) => ({
    type: constant.CUSTOMER_LIST_SUCCESS,
    data
});
const fetchCustomerListFailure = (error) => ({
    type: constant.CUSTOMER_LIST_FAILURE,
    error
});
/**
 * 获取客户列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchCustomerList = (params,callback) => dispatch => {
    dispatch(fetchCustomerList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/customer/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchCustomerListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchCustomerListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchCustomerListFailure(error));
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
 * 获取客户列表数据
 **/
const fetchCustomerApplyList = () => ({
    type: constant.CUSTOMER_APPLY_LIST
});
export const fetchCustomerApplyListSuccess = (data) => ({
    type: constant.CUSTOMER_APPLY_LIST_SUCCESS,
    data
});
const fetchCustomerApplyListFailure = (error) => ({
    type: constant.CUSTOMER_APPLY_LIST_FAILURE,
    error
});
/**
 * 获取客户申请列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchCustomerApplyList = (params,callback) => dispatch => {
    dispatch(fetchCustomerApplyList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/customer/apply/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchCustomerApplyListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchCustomerApplyListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchCustomerApplyListFailure(error));
    });
};

export const asyncAddToBlackList = (customer,callback) => dispatch => {
    axios.post(`/api/customer/mall/addToBlacklist`,customer).then(function(res) {
        callback(res.data);
    }).catch(error => {
        alert(error);
    });
};

/**
 * 删除客户信息
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncDeleteCustomerInfo = (ids, callback) => dispatch => {
    axios.post(`/api/customer/delete`,{
        ids:ids
    }).then(function(res) {
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
export const asyncToggleCustomerInfo = (ids,disableFlag, callback) => dispatch => {
    axios.post(`/api/customer/disable`,{
        disableFlag,
        ids
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
export const fetchCustomerByValRequest = () => ({
    type: constant.FETCH_CUSTOMER_BY_VAL_REQUEST
});

export const fetchCustomerByValSuccess = (data) => ({
    type: constant.FETCH_CUSTOMER_BY_VAL_SUCCESS,
    data
});

export const fetchCustomerByValFailure = (error) => ({
    type: constant.FETCH_CUSTOMER_BY_VAL_FAILURE,
    error
});


let timeout;
let currentValue;
// isBound 是否已绑定百卓账号， 1绑定，0为绑定，null都查
export const asyncFetchCustomerByVal = (value,isBound=null, callback) => dispatch => {

    dispatch(fetchCustomerByValRequest());

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake(){
        axios.get(`${BASE_URL}/customer/search/by/name/`, {
            params: {
                key: value,
                isBound,
                searchType:'like'
            }
        }).then(function(res) {
            if (res.data) {
                dispatch(fetchCustomerByValSuccess(fromJS(res.data)));
                callback && callback(fromJS(res.data.data));
            }
        }).catch(error => {
            dispatch(fetchCustomerByValFailure(error));
        });
    }

    timeout = setTimeout(fake, 300);

};

/**
 * 设置分销客户
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncSetDistribute = (ids,optionFlag, callback) => dispatch => {
    axios.post(`${BASE_URL}/customer/setDistribute`,{
        ids,
        optionFlag
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};


/**
 * 获取客户价格列表数据
 **/
const fetchCustomerPriceList = () => ({
    type: constant.FETCH_CUSTOMER_PRICE_RECORD_REQUEST
});
export const fetchCustomerPriceListSuccess = (data) => ({
    type: constant.FETCH_CUSTOMER_PRICE_RECORD_SUCCESS,
    data
});
const fetchCustomerPriceListFailure = (error) => ({
    type: constant.FETCH_CUSTOMER_PRICE_RECORD_FAILURE,
    error
});
/**
 * 获取客户列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchCustomerPriceList = (params,callback) => dispatch => {
    dispatch(fetchCustomerPriceList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/customer/cusprice`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchCustomerPriceListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchCustomerPriceListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchCustomerPriceListFailure(error));
    });
};


/**
 * 获取开通订单追踪详情
 * @param params
 * @returns {Function}
 */
export const asyncFetchOrderTrackDetail = (params, callback) => dispatch => {
    axios.get(`/api/customer/orderTrack`,{params}).then(function(res) {
        if (res.data && res.data.retCode==="0") {
            if(callback){
                callback(res.data);
            }
        }
    });
};

/**
 * 获取开通订单追踪
 * @param params
 * @returns {Function}
 */
export const asyncUpdateOrderTrack = (params, callback) => dispatch => {
    axios.post(`/api/customer/orderTrack`,params).then(function(res) {
        if(callback){
            callback(res.data);
        }
    });
};

