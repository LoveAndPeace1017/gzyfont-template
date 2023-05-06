import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取多币种列表
 **/
const fetchMultiCurrencyListRequest = () => ({
    type: constant.FETCH_MULTI_CURRENCY_LIST_REQUEST
});

const fetchMultiCurrencyListSuccess = (data) => ({
    type: constant.FETCH_MULTI_CURRENCY_LIST_SUCCESS,
    data
});

const fetchMultiCurrencyListFailure = (error) => ({
    type: constant.FETCH_MULTI_CURRENCY_LIST_FAILURE,
    error
});

export const asyncFetchMultiCurrencyList = (callback) => dispatch => {
    dispatch(fetchMultiCurrencyListRequest());
    axios.get(`${BASE_URL}/auxiliary/multiCurrency/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchMultiCurrencyListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchMultiCurrencyListFailure(error));
    });

};


/**
 * 新增/修改/删除多币种
 **/
const addMultiCurrencyRequest = () => ({
    type: constant.ADD_MULTI_CURRENCY_REQUEST
});

const addMultiCurrencySuccess = (data) => ({
    type: constant.ADD_MULTI_CURRENCY_SUCCESS,
    data
});

const addMultiCurrencyFailure = (error) => ({
    type: constant.ADD_MULTI_CURRENCY_FAILURE,
    error
});

export const asyncAddMultiCurrency = (type, values, callback) => dispatch => {
    dispatch(addMultiCurrencyRequest());
    let url = `${BASE_URL}/auxiliary/multiCurrency/oprate/${type}`;
    axios.post(url, values).then(res => {
        dispatch(addMultiCurrencySuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addMultiCurrencyFailure(error));
    })
};


const asyncFetchCurrencyDetailRequest = () => ({
    type: constant.FETCH_CURRENCY_DETAIL_REQUEST
});

const asyncFetchCurrencyDetailSuccess = (data) => ({
    type: constant.FETCH_CURRENCY_DETAIL_SUCCESS,
    data
});

const asyncFetchCurrencyDetailFailure = (error) => ({
    type: constant.FETCH_CURRENCY_DETAIL_FAILURE,
    error
});

export const asyncFetchCurrencyDetail = (currencyId, callback) => dispatch => {
    dispatch(asyncFetchCurrencyDetailRequest());
    axios.get(`${BASE_URL}/auxiliary/multiCurrency/detail/${currencyId}`).then(function(res) {
        if(res.data.retCode === "0"){
            dispatch(asyncFetchCurrencyDetailSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(asyncFetchCurrencyDetailFailure());
        alert(error);
    });
};

