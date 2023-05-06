import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';
const setConfirmFetchingTrue = (data) => ({
    type: constant.SUPPLIER_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.SUPPLIER_CONFIRM_FETCHING_FALSE,
    error
});


export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`/api/supplier/listStatistics/`).then(function(res) {
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
const fetchSupplierList = () => ({
    type: constant.SUPPLIER_LIST
});
const fetchSupplierListSuccess = (data) => ({
    type: constant.SUPPLIER_LIST_SUCCESS,
    data
});
const fetchSupplierListFailure = (error) => ({
    type: constant.SUPPLIER_LIST_FAILURE,
    error
});
/**
 * 获取供应商列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchSupplierList = (params,callback) => dispatch => {
    dispatch(fetchSupplierList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/supplier/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSupplierListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchSupplierListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchSupplierListFailure(error));
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

const fetchLocalSupplierInfo = (id) => ({
    type: constant.GET_LOCAL_SUPPLIER_INFO,
    id
});

export const getLocalSupplierInfo = (id) => dispatch => {
    dispatch(fetchLocalSupplierInfo(id))
};

/**
 * 修改仓库信息
 * @param supplier
 * @param callback
 * @returns {Function}
 */
export const asyncModifySupplierInfo = (supplier,callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`/api/supplier/modify`,supplier).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(supplier)))
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
 * @param supplier
 * @param callback
 * @returns {Function}
 */
export const asyncInsertSupplierInfo = (supplier, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`/api/supplier/insert`,supplier).then(function(res) {
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

export const asyncRecommedSupplyInfo = (info, callback) => dispatch => {
    axios.post(`/api/supplier/recommend`,info).then(function(res) {
        if (res.data && res.data.retCode === "0") {
            callback && callback(res.data)
        }
    }).catch(error => {

    });
};



export const asyncDeleteSupplierInfo = (ids, callback) => dispatch => {
    axios.post(`/api/supplier/delete`,{
        ids:ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
export const asyncToggleSupplierInfo = (ids, disableFlag, callback) => dispatch => {
    axios.post(`/api/supplier/disable`,{
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
export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);


/**
 * 供应商联想选择
 **/
export const fetchSupplierByValRequest = () => ({
    type: constant.FETCH_SUPPLIER_BY_VAL_REQUEST
});

export const fetchSupplierByValSuccess = (data) => ({
    type: constant.FETCH_SUPPLIER_BY_VAL_SUCCESS,
    data
});

export const fetchSupplierByValFailure = (error) => ({
    type: constant.FETCH_SUPPLIER_BY_VAL_FAILURE,
    error
});


let timeout;
let currentValue;
export const asyncFetchSupplierByVal = (value, callback) => dispatch => {

    dispatch(fetchSupplierByValRequest());

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake(){
        axios.get(`${BASE_URL}/supplier/search/by/name/`, {
            params: {
                key: value,
                searchType:'like'
            }
        }).then(function(res) {
            if (res.data) {
                dispatch(fetchSupplierByValSuccess(fromJS(res.data)));
                callback && callback(fromJS(res.data.data));
            }
        }).catch(error => {
            dispatch(fetchSupplierByValFailure(error));
        });
    }

    timeout = setTimeout(fake, 300);

};

