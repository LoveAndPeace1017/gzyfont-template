import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 新增销售开票记录提交
 **/
const addSaleInvoiceRequest = () => ({
    type: constant.ADD_SALEINVOICE_REQUEST
});

const addSaleInvoiceSuccess = (data) => ({
    type: constant.ADD_SALEINVOICE_SUCCESS,
    data
});

const addSaleInvoiceFailure = (error) => ({
    type: constant.ADD_SALEINVOICE_FAILURE,
    error
});

export const asyncAddSaleInvoice = (values, callback) => dispatch => {
    dispatch(addSaleInvoiceRequest());
    let url = `${BASE_URL}/finance/saleinvoices/insert`;
    axios.post(url, values).then(res => {
        dispatch(addSaleInvoiceSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addSaleInvoiceFailure(error));
    })
};

export const asyncEditSaleInvoice = (values, callback) => dispatch => {
    dispatch(addSaleInvoiceRequest());
    let url = `${BASE_URL}/finance/saleinvoices/edit`;
    axios.put(url, {
        ...values
    }).then(res => {
        dispatch(addSaleInvoiceSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addSaleInvoiceFailure(error));
    })
};

/**
 * 根据收入记录id获取收入记录信息
 **/
export const fetchSaleInvoiceByIdRequest = () => ({
    type: constant.FETCH_SALEINVOICE_BY_ID_REQUEST
});

export const fetchSaleInvoiceByIdSuccess = (data) => ({
    type: constant.FETCH_SALEINVOICE_BY_ID_SUCCESS,
    data
});

export const fetchSaleInvoiceByIdFailure = (error) => ({
    type: constant.FETCH_SALEINVOICE_BY_ID_FAILURE,
    error
});

export const asyncFetchSaleInvoiceById = (id, callback) => dispatch => {

    dispatch(fetchSaleInvoiceByIdRequest());
    axios.get(`${BASE_URL}/finance/saleinvoices/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchSaleInvoiceByIdSuccess(fromJS(res.data)));
            callback && callback(fromJS(res.data));
        }
    }).catch(error => {
        dispatch(fetchSaleInvoiceByIdFailure(error));
    });
};
