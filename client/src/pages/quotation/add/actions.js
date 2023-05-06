import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 获取页面初始数据
 **/
const fetchPreDataRequest = () => ({
    type: constant.FETCH_PRE_DATA_REQUEST
});

const fetchPreDataSuccess = (data) => ({
    type: constant.FETCH_PRE_DATA_SUCCESS,
    data
});

const fetchPreDataFailure = (error) => ({
    type: constant.FETCH_PRE_DATA_FAILURE,
    error
});

export const asyncFetchPreData = (callback) => dispatch => {
    dispatch(fetchPreDataRequest());
    axios.get(`${BASE_URL}/quotation/pre/create`).then(function (res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增报价单提交
 **/
const addQuotationRequest = () => ({
    type: constant.ADD_QUOTATION_REQUEST
});

const addQuotationSuccess = (data) => ({
    type: constant.ADD_QUOTATION_SUCCESS,
    data
});

const addQuotationFailure = (error) => ({
    type: constant.ADD_QUOTATION_FAILURE,
    error
});

export const asyncAddQuotation = (billNo, values, callback) => dispatch => {
    dispatch(addQuotationRequest());
    let url = billNo ? `${BASE_URL}/quotation/modify/${billNo}` : `${BASE_URL}/quotation/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addQuotationSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addQuotationFailure(error));
    })
};


/**
 * 根据报价单id获取销售单信息
 **/
export const fetchQuotationByIdRequest = () => ({
    type: constant.FETCH_QUOTATION_BY_ID_REQUEST
});

export const fetchQuotationByIdSuccess = (data) => ({
    type: constant.FETCH_QUOTATION_BY_ID_SUCCESS,
    data
});

export const fetchQuotationByIdFailure = (error) => ({
    type: constant.FETCH_QUOTATION_BY_ID_FAILURE,
    error
});



export const updateProdBindInfo = (data) => ({
    type: constant.UPDATE_BIND_PRODUCT_INFO,
    data
});

export const requestBindProduct = (data) => ({
    type: constant.REQUEST_BIND_PRODUCT,
    data
});

export const requestBindProductSucc = (data) => ({
    type: constant.REQUEST_BIND_PRODUCT_SUCCESS,
    data
});

export const requestBindProductFailed = (data) => ({
    type: constant.REQUEST_BIND_PRODUCT_FAILED,
    data
});

export const asyncBindProduct = (params, callback) => dispatch => {
    dispatch(requestBindProduct(params));
    axios.post(`${BASE_URL}/goods/bind/${params.prodNo}`, params).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(requestBindProductSucc(params));
        } else {
            dispatch(requestBindProductFailed(params));
        }
        callback && callback(res.data);
    }).catch(error => {
        dispatch(requestBindProductFailed(params));
        alert(error);
    });
};

export const asyncUnbindProduct = (params, callback) => dispatch => {
    dispatch(requestBindProduct(params));
    axios.post(`${BASE_URL}/goods/unbind/${params.prodNo}`, params).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            params.prodNo = '-';
            params.prodCustomNo = '-';
            dispatch(requestBindProductSucc(params));
        } else {
            dispatch(requestBindProductFailed(params));
        }
        callback && callback(res.data);
    }).catch(error => {
        dispatch(requestBindProductFailed(params));
        alert(error);
    });
};

export const asyncFetchQuotationById = (id, callback) => dispatch => {

    dispatch(fetchQuotationByIdRequest());
    axios.get(`${BASE_URL}/quotation/detail/${id}`).then(function (res) {
        if (res.data) {
            dispatch(fetchQuotationByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchQuotationByIdFailure(error));
    });
};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});

//审批&反审(单个)
export const asyncApproved = ({type, ...params}, callback) => dispatch => {
    // type 0 审批  1 反审
    let uri = (type != 1) ? `${BASE_URL}/sale/approve/single` : `${BASE_URL}/sale/approve/counter/single`;
    axios.post(uri, params).then(function(res) {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    });
};

/**
 * 获取操作日志
 **/
export const asyncFetchOperationLogRequest = () => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_REQUEST
});

export const asyncFetchOperationLogSuccess = (data) => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_SUCCESS,
    data
});

export const asyncFetchOperationLogFailure = (error) => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_FAILURE,
    error
});


//审批操作日志
export const asyncFetchOperationLog = (billNo, callback) => dispatch => {
    dispatch(asyncFetchOperationLogRequest());
    axios.get(`${BASE_URL}/sale/approve/log/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            let { logSaleOrderList } = res.data;
            dispatch(asyncFetchOperationLogSuccess(fromJS(logSaleOrderList)));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(asyncFetchOperationLogFailure());
        alert(error);
    });
};











