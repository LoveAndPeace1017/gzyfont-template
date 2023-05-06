import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

export const cancelOrder = () => ({
    type: constant.CANCEL_ORDER_REQUEST
});

const cancelOrderSuccess = (data) => ({
    type: constant.CANCEL_ORDER_SUCCESS,
    data
});
const cancelOrderFailure = (error) => ({
    type: constant.CANCEL_ORDER_FAILURE,
    error
});

export const asyncCancelOrder = (id, billType, params, callback) => dispatch => {
    dispatch(cancelOrder());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    let url = billType ? `${BASE_URL}/${billType}/cancel/${id}` : `${BASE_URL}/sale/cancel/${id}`;
    axios.post(url, params).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(cancelOrderSuccess(fromJS(res.data)));
        } else {
            dispatch(cancelOrderFailure(res.data.retMsg));
        }
        callback && callback(fromJS(res.data));
    }).catch(error => {
        dispatch(cancelOrderFailure(error));
    });
};

export const acceptOrder = () => ({
    type: constant.ACCEPT_ORDER_REQUEST
});

const acceptOrderSuccess = (data) => ({
    type: constant.ACCEPT_ORDER_SUCCESS,
    data
});
const acceptOrderFailure = (error) => ({
    type: constant.ACCEPT_ORDER_FAILURE,
    error
});

export const asyncAcceptOrder = (billNo, callback) => dispatch => {
    dispatch(acceptOrder());
    axios.post(`${BASE_URL}/sale/confirm/${billNo}`, {}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(acceptOrderSuccess(fromJS(res.data)));
        } else {
            dispatch(acceptOrderFailure(res.data.retMsg));
        }
        callback && callback(fromJS(res.data));
    }).catch(error => {
        dispatch(acceptOrderFailure(error));
    });
};

export const requestConvertLocalProd = () => ({
    type: constant.REQUEST_CONVERT_LOCAL_PROD
});

export const requestConvertLocalProdSucc = () => ({
    type: constant.REQUEST_CONVERT_LOCAL_PROD_SUCCESS
});

export const requestConvertLocalProdFailed = () => ({
    type: constant.REQUEST_CONVERT_LOCAL_PROD_FAILED
});


export const asyncConvertToLocalProd = (billType, params, callback) => dispatch => {
    dispatch(requestConvertLocalProd());
    axios.post(`${BASE_URL}/${billType}/convertToLocalProd`, {ids: params}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(requestConvertLocalProdSucc());
        } else {
            dispatch(requestConvertLocalProdFailed());
        }
        callback && callback(res.data);
    }).catch(error => {
        dispatch(requestConvertLocalProdFailed());
        alert(error);
    });
};