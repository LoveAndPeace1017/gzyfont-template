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
    axios.get(`${BASE_URL}/sale/pre/create`).then(function (res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增销售单提交
 **/
const addSaleRequest = () => ({
    type: constant.ADD_SALE_REQUEST
});

const addSaleSuccess = (data) => ({
    type: constant.ADD_SALE_SUCCESS,
    data
});

const addSaleFailure = (error) => ({
    type: constant.ADD_SALE_FAILURE,
    error
});

export const asyncAddSale = (billNo, values, callback) => dispatch => {
    dispatch(addSaleRequest());
    let url = billNo ? `${BASE_URL}/sale/modify/${billNo}` : `${BASE_URL}/sale/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addSaleSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addSaleFailure(error));
    })
};


/**
 * 根据销售单id获取销售单信息
 **/
export const fetchSaleByIdRequest = () => ({
    type: constant.FETCH_SALE_BY_ID_REQUEST
});

export const fetchSaleByIdSuccess = (data) => ({
    type: constant.FETCH_SALE_BY_ID_SUCCESS,
    data
});

export const fetchSaleByIdFailure = (error) => ({
    type: constant.FETCH_SALE_BY_ID_FAILURE,
    error
});

// export const updateBindProductCode = (data) => ({
//     type: constant.UPDATE_BIND_PRODUCT_INFO,
//     data
// });

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

export const asyncFetchSaleById = (id, callback) => dispatch => {

    dispatch(fetchSaleByIdRequest());
    axios.get(`${BASE_URL}/sale/detail/${id}`).then(function (res) {
        if (res.data) {
            dispatch(fetchSaleByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSaleByIdFailure(error));
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











