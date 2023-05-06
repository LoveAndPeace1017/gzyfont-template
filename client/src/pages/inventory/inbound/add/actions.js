import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";



/**
 * 获取页面初始数据
 **/
const fetchPreDataRequest = () => ({
    type: constant.FETCH_INBOUND_PRE_DATA_REQUEST
});

const fetchPreDataSuccess = (data) => ({
    type: constant.FETCH_INBOUND_PRE_DATA_SUCCESS,
    data
});

const fetchPreDataFailure = (error) => ({
    type: constant.FETCH_INBOUND_PRE_DATA_FAILURE,
    error
});

export const asyncFetchPreData = (callback) => dispatch => {

    dispatch(fetchPreDataRequest());
    axios.get(`${BASE_URL}/inventory/in/pre/create`).then(function(res) {
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

export const asyncAddSale = (id, values, callback) => dispatch => {
    /*dispatch(addSaleRequest());*/
    let url = id?`${BASE_URL}/inventory/in/modify`:`${BASE_URL}/inventory/in/insert`;

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

export const asyncFetchInboundById = (id, callback) => dispatch => {

    dispatch(fetchSaleByIdRequest());
    axios.get(`${BASE_URL}/inventory/in/detail/${id}/edit`).then(function(res) {
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













