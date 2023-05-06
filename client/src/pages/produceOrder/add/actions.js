import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


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
    axios.get(`${BASE_URL}/produceOrder/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增生产单
 **/
const addProduceOrderRequest = () => ({
    type: constant.ADD_PRODUCE_ORDER_REQUEST
});

const addProduceOrderSuccess = (data) => ({
    type: constant.ADD_PRODUCE_ORDER_SUCCESS,
    data
});

const addProduceOrderFailure = (error) => ({
    type: constant.ADD_PRODUCE_ORDER_FAILURE,
    error
});

export const asyncAddProduceOrder = (billNo, values, callback) => dispatch => {
    dispatch(addProduceOrderRequest());
    let url = billNo?`${BASE_URL}/produceOrder/modify/${billNo}`:`${BASE_URL}/produceOrder/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addProduceOrderSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addProduceOrderFailure(error));
    })
};


/**
 * 根据id获取生产单详情
 **/
export const fetchProduceOrderByIdRequest = () => ({
    type: constant.FETCH_PRODUCE_ORDER_BY_ID_REQUEST
});

export const fetchProduceOrderByIdSuccess = (data) => ({
    type: constant.FETCH_PRODUCE_ORDER_BY_ID_SUCCESS,
    data
});

export const fetchProduceOrderByIdFailure = (error) => ({
    type: constant.FETCH_PRODUCE_ORDER_BY_ID_FAILURE,
    error
});

export const asyncFetchProduceOrderById = (id, callback) => dispatch => {
    dispatch(fetchProduceOrderByIdRequest());
    axios.get(`${BASE_URL}/produceOrder/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchProduceOrderByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchProduceOrderByIdFailure(error));
    });
};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});


export const fetchSaleOrderPopRequest = () => ({
    type: constant.FETCH_SALE_ORDER_POP_LIST_REQUEST
});

export const fetchSaleOrderPopSuccess = (data) => ({
    type: constant.FETCH_SALE_ORDER_POP_LIST_SUCCESS,
    data
});

export const fetchSaleOrderPopFailure = (error) => ({
    type: constant.FETCH_SALE_ORDER_POP_LIST_FAILURE,
    error
});

/**
 * 新建生产单-选择销售物品
 * @param params
 * @returns {Function}
 */
export const asyncFetchSaleOrderPopList = (params,callback) => dispatch => {
    dispatch(fetchSaleOrderPopRequest());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/produceOrder/saleOrder/pop/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSaleOrderPopSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchSaleOrderPopFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchSaleOrderPopFailure(error));
    });
};


export const setSaleOrderPopData = (data) => ({
    type: constant.SET_SALE_ORDER_POP,
    data
});






