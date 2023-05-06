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
    axios.get(`${BASE_URL}/purchase/pre/create`).then(function(res) {
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
const addPurchaseRequest = () => ({
    type: constant.ADD_PURCHASE_REQUEST
});

const addPurchaseSuccess = (data) => ({
    type: constant.ADD_PURCHASE_SUCCESS,
    data
});

const addPurchaseFailure = (error) => ({
    type: constant.ADD_PURCHASE_FAILURE,
    error
});

export const asyncAddPurchase = (billNo, values, callback) => dispatch => {
    dispatch(addPurchaseRequest());
    let url = billNo?`${BASE_URL}/purchase/modify/${billNo}`:`${BASE_URL}/purchase/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addPurchaseSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addPurchaseFailure(error));
    })
};


/**
 * 根据销售单id获取销售单信息
 **/
export const fetchPurchaseByIdRequest = () => ({
    type: constant.FETCH_PURCHASE_BY_ID_REQUEST
});

export const fetchPurchaseByIdSuccess = (data) => ({
    type: constant.FETCH_PURCHASE_BY_ID_SUCCESS,
    data
});

export const fetchPurchaseByIdFailure = (error) => ({
    type: constant.FETCH_PURCHASE_BY_ID_FAILURE,
    error
});

export const asyncFetchPurchaseById = (id, callback) => dispatch => {

    dispatch(fetchPurchaseByIdRequest());
    axios.get(`${BASE_URL}/purchase/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchPurchaseByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPurchaseByIdFailure(error));
    });
};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
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

/**
 * 获取操作日志
 **/
const asyncFetchOperationLogRequest = () => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_REQUEST
});

const asyncFetchOperationLogSuccess = (data) => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_SUCCESS,
    data
});

const asyncFetchOperationLogFailure = (error) => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_FAILURE,
    error
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


//审批&反审(单个)
export const asyncApproved = ({type, ...params}, callback) => dispatch => {
    // type 0 审批  1 反审
    let uri = (type != 1) ? `${BASE_URL}/purchase/approve/single` : `${BASE_URL}/purchase/approve/counter/single`;
    axios.post(uri, params).then(function(res) {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    });
};

//审批操作日志
export const asyncFetchOperationLog = (billNo, callback) => dispatch => {
    dispatch(asyncFetchOperationLogRequest());
    axios.get(`${BASE_URL}/purchase/approve/log/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            let { logOrderList } = res.data;
            dispatch(asyncFetchOperationLogSuccess(fromJS(logOrderList)));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(asyncFetchOperationLogFailure());
        alert(error);
    });
};

//根据物品编号获取物品信息
export const asyncFetchGoodsDataByProdNo = (params, callback) =>  dispatch => {
    axios.post(`${BASE_URL}/purchase/getDataByProdNo`,params).then(function(res) {
        if(res.data.retCode === "0"){
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
}





