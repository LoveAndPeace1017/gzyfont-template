import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

const setConfirmFetchingTrue = (data) => ({
    type: constant.QUOTATION_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.QUOTATION_CONFIRM_FETCHING_FALSE,
    error
});

const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_QUOTATION_CONFIG_SUCCESS,
    data
});

export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/quotation/config/`).then(function(res) {
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
    axios.get(`${BASE_URL}/quotation/listStatistics/`).then(function(res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode:1,
            retMsg:error
        });
    });
};


const fetchQuotationList = () => ({
    type: constant.QUOTATION_LIST
});
const fetchQuotationListSuccess = (data) => ({
    type: constant.QUOTATION_LIST_SUCCESS,
    data
});
const fetchQuotationListFailure = (error) => ({
    type: constant.QUOTATION_LIST_FAILURE,
    error
});
/**
 * 获取报价列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchQuotationList = (params,callback) => dispatch => {
    dispatch(fetchQuotationList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/quotation/list`,{
        params:{
            page: 1,
            // perPage: 3,
            ...params
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchQuotationListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchQuotationListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchQuotationListFailure(error));
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

const fetchLocalQuotationInfo = (id) => ({
    type: constant.GET_LOCAL_QUOTATION_INFO,
    id
});

export const getLocalQuotationInfo = (id) => dispatch => {
    dispatch(fetchLocalQuotationInfo(id))
};


export const asyncModifyQuotationInfo = (sale,callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`${BASE_URL}/quotation/modify`,sale).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(sale)))
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
 * 新增物品信息
 * @param sale
 * @param callback
 * @returns {Function}
 */
export const asyncInsertQuotationInfo = (sale, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`${BASE_URL}/quotation/insert`,sale).then(function(res) {
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

export const asyncDeleteQuotationInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/quotation/delete`,{
        ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
//删除确认
export const asyncBeforeDeleteQuotationInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/quotation/beforeDelete`,{
        ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
export const asyncToggleQuotationInfo = (id, disableFlag, callback) => dispatch => {
    let url = disableFlag? `${BASE_URL}/quotation/status/enable/${id}`: `${BASE_URL}/quotation/status/disable/${id}`;
    axios.post(url).then(function(res) {
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
const updateConfigByFieldName = (data) => ({
    type: constant.QUOTATION_UPDATE_CONFIG_FIELD_NAME,
    data
});

export const asyncUpdateConfig = (type, fieldName,propName,index,value) => dispatch => {
    if(index === null){
        dispatch(updateConfigByFieldName({
            type1:type,
            fieldName,
            propName1:propName,
            value1:value
        }));
    }else{
        dispatch(updateConfig({
            type, fieldName,propName,index,value
        }));
    }
};

export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);



/**
 * 获取销售记录
 **/
const fetchSaleRecordRequest = () => ({
    type: constant.FETCH_SALE_RECORD_REQUEST
});
const fetchSaleRecordSuccess = (data) => ({
    type: constant.FETCH_SALE_RECORD_SUCCESS,
    data
});
const fetchSaleRecordFailure = () => ({
    type: constant.FETCH_SALE_RECORD_FAILURE
});
export const asyncFetchSaleRecord = ({recordFor, type, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchSaleRecordRequest());
    axios.get(`${BASE_URL}/sale/record/for/${recordFor}`,{
        params: {
            type,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSaleRecordSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchSaleRecordFailure());
        }
    }).catch(error => {
        dispatch(fetchSaleRecordFailure(error));
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
    axios.get(`${BASE_URL}/quotation/listSale`, {params: {billNo: billNo}}).then(function (res) {
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
    let uri = (type == 0) ? `${BASE_URL}/sale/approve/list` : `${BASE_URL}/sale/approve/counter/list`;
    axios.post(uri, params).then(function(res) {
        if(res.data){
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
