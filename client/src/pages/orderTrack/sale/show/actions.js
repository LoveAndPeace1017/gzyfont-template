import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const newDomain = '//order.abiz.com/api';

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

export const asyncFetchSaleById = (id, callback) => dispatch => {

    dispatch(fetchSaleByIdRequest());
    axios.get(`${newDomain}/orderTrack/sale/detail/${id}`).then(function (res) {
        if (res.data) {
            dispatch(fetchSaleByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSaleByIdFailure(error));
    });
};


/**
 * 获取出库记录
 **/
const fetchOutboundRecordRequest = () => ({
    type: constant.FETCH_OUTBOUND_RECORD_REQUEST
});
const fetchOutboundRecordSuccess = (data) => ({
    type: constant.FETCH_OUTBOUND_RECORD_SUCCESS,
    data
});
const fetchOutboundRecordFailure = () => ({
    type: constant.FETCH_OUTBOUND_RECORD_FAILURE
});
export const asyncFetchOutboundRecord = ({recordFor, type, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchOutboundRecordRequest());
    axios.get(`${newDomain}/orderTrack/sale/out/record/for/${recordFor}`,{
        params: {
            type,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchOutboundRecordSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchOutboundRecordFailure());
        }
    }).catch(error => {
        dispatch(fetchOutboundRecordFailure(error));
    });
};


/**
 * 获取付款记录
 * @param params
 * @returns {Function}
 */

const fetchIncomeRecordRequest = () => ({
    type: constant.FETCH_INCOME_RECORD_REQUEST
});
const fetchIncomeRecordSuccess = (data) => ({
    type: constant.FETCH_INCOME_RECORD_SUCCESS,
    data
});
const fetchIncomeRecordFailure = () => ({
    type: constant.FETCH_INCOME_RECORD_FAILURE
});

export const asyncFetchIncomeRecord = ({type, recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchIncomeRecordRequest());
    axios.get(`${newDomain}/orderTrack/sale/income/record`,{
        params: {
            type,
            recordFor,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchIncomeRecordSuccess(res.data));

        }else{
            dispatch(fetchIncomeRecordFailure());
        }

        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchIncomeRecordFailure(error));
    });
};



const fetchSaleInvoiceRecordRequest = () => ({
    type: constant.FETCH_SALEINVOICE_RECORD_REQUEST
});
const fetchSaleInvoiceRecordSuccess = (data) => ({
    type: constant.FETCH_SALEINVOICE_RECORD_SUCCESS,
    data
});
const fetchSaleInvoiceRecordFailure = () => ({
    type: constant.FETCH_SALEINVOICE_RECORD_FAILURE
});

export const asyncFetchSaleInvoiceRecord = ({type, recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchSaleInvoiceRecordRequest());
    axios.get(`${newDomain}/orderTrack/sale/saleinvoice/record`,{
        params: {
            type,
            recordFor,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSaleInvoiceRecordSuccess(res.data));

        }else{
            dispatch(fetchSaleInvoiceRecordFailure());
        }

        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSaleInvoiceRecordFailure(error));
    });
};

/**
* 获取生产记录
* @param params
* @returns {Function}
*/
const fetchProduceRecordRequest = () => ({
    type: constant.FETCH_PRODUCE_RECORD_REQUEST
});
const fetchProduceRecordSuccess = (data) => ({
    type: constant.FETCH_PRODUCE_RECORD_SUCCESS,
    data
});
const fetchProduceRecordFailure = () => ({
    type: constant.FETCH_PRODUCE_RECORD_FAILURE
});

export const asyncFetchProduceRecord = ({recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchProduceRecordRequest());
    axios.get(`${newDomain}/orderTrack/sale/produceOrder/record`,{
        params: {
            recordFor,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchProduceRecordSuccess(res.data));

        }else{
            dispatch(fetchProduceRecordFailure());
        }

        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchProduceRecordFailure(error));
    });
};


