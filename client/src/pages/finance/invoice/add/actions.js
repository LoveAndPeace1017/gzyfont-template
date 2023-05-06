import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 新增销售开票记录提交
 **/
const addInvoiceRequest = () => ({
    type: constant.ADD_INVOICE_REQUEST
});

const addInvoiceSuccess = (data) => ({
    type: constant.ADD_INVOICE_SUCCESS,
    data
});

const addInvoiceFailure = (error) => ({
    type: constant.ADD_INVOICE_FAILURE,
    error
});

export const asyncAddInvoice = (values, callback) => dispatch => {
    dispatch(addInvoiceRequest());
    let url = `${BASE_URL}/finance/invoices/insert`;
    axios.post(url, values).then(res => {
        dispatch(addInvoiceSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addInvoiceFailure(error));
    })
};

export const asyncEditInvoice = (values, callback) => dispatch => {
    dispatch(addInvoiceRequest());
    let url = `${BASE_URL}/finance/invoices/edit`;
    axios.put(url, {
        ...values
    }).then(res => {
        dispatch(addInvoiceSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addInvoiceFailure(error));
    })
};

/**
 * 根据收入记录id获取收入记录信息
 **/
export const fetchInvoiceByIdRequest = () => ({
    type: constant.FETCH_INVOICE_BY_ID_REQUEST
});

export const fetchInvoiceByIdSuccess = (data) => ({
    type: constant.FETCH_INVOICE_BY_ID_SUCCESS,
    data
});

export const fetchInvoiceByIdFailure = (error) => ({
    type: constant.FETCH_INVOICE_BY_ID_FAILURE,
    error
});

export const asyncFetchInvoiceById = (id, callback) => dispatch => {

    dispatch(fetchInvoiceByIdRequest());
    axios.get(`${BASE_URL}/finance/invoices/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchInvoiceByIdSuccess(fromJS(res.data)));
            callback && callback(fromJS(res.data));
        }
    }).catch(error => {
        dispatch(fetchInvoiceByIdFailure(error));
    });
};
