import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 发送给供应商
 **/
const send2supplierRequest = () => ({
    type: constant.SEND_TO_SUPPLIER_REQUEST
});

const send2supplierSuccess = (data) => ({
    type: constant.SEND_TO_SUPPLIER_SUCCESS,
    data
});

const send2supplierFailure = (error) => ({
    type: constant.SEND_TO_SUPPLIER_FAILURE,
    error
});

export const asyncSend2supplier = (billNo, callback) => dispatch => {
    dispatch(send2supplierRequest());
    axios.post(`${BASE_URL}/purchase/send2supplier/${billNo}`).then(res => {
        dispatch(send2supplierSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(send2supplierFailure(error));
    })
};

/**
 * 发送邮件给供应商
 **/
const sendEmailRequest = () => ({
    type: constant.SEND_EMAIL_REQUEST
});

const sendEmailSuccess = (data) => ({
    type: constant.SEND_EMAIL_SUCCESS,
    data
});

const sendEmailFailure = (error) => ({
    type: constant.SEND_EMAIL_FAILURE,
    error
});

export const asyncSendEmail = (billNo, values, callback) => dispatch => {
    dispatch(sendEmailRequest());
    axios.post(`${BASE_URL}/purchase/sendEmail/${billNo}`, values).then(res => {
        dispatch(sendEmailSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(sendEmailFailure(error));
    })
};


/**
 * 获取物流信息
 **/
const expressInfoRequest = () => ({
    type: constant.EXPRESS_INFO_REQUEST
});

const expressInfoSuccess = (data) => ({
    type: constant.EXPRESS_INFO_SUCCESS,
    data
});

const expressInfoFailure = (error) => ({
    type: constant.EXPRESS_INFO_FAILURE,
    error
});
export const asyncExpressInfo = (params,callback) => dispatch => {
    dispatch(expressInfoRequest());
    axios.post(`${BASE_URL}/purchase/get/expressInfor`, params).then(res => {
        dispatch(expressInfoSuccess(fromJS(res.data)));
        callback && callback(res);
    }).catch(error => {
        dispatch(expressInfoFailure(error));
    })
};