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

/**
 * 预加载请购单数据
 **/
export const asyncFetchPreData = (callback) => dispatch => {
    dispatch(fetchPreDataRequest());
    axios.get(`${BASE_URL}/requisitionOrder/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增请购单
 **/
const addRequisitionOrderRequest = () => ({
    type: constant.ADD_REQUISITION_ORDER_REQUEST
});

const addRequisitionOrderSuccess = (data) => ({
    type: constant.ADD_REQUISITION_ORDER_SUCCESS,
    data
});

const addRequisitionOrderFailure = (error) => ({
    type: constant.ADD_REQUISITION_ORDER_FAILURE,
    error
});

export const asyncAddRequisitionOrder = (billNo, values, callback) => dispatch => {
    dispatch(addRequisitionOrderRequest());
    let url = billNo?`${BASE_URL}/requisitionOrder/modify/${billNo}`:`${BASE_URL}/requisitionOrder/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addRequisitionOrderSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addRequisitionOrderFailure(error));
    })
};


/**
 * 根据id获取请购单详情
 **/
export const fetchRequisitionOrderByIdRequest = () => ({
    type: constant.FETCH_REQUISITION_ORDER_BY_ID_REQUEST
});

export const fetchRequisitionOrderByIdSuccess = (data) => ({
    type: constant.FETCH_REQUISITION_ORDER_BY_ID_SUCCESS,
    data
});

export const fetchRequisitionOrderByIdFailure = (error) => ({
    type: constant.FETCH_REQUISITION_ORDER_BY_ID_FAILURE,
    error
});

export const asyncFetchRequisitionOrderById = (id, callback) => dispatch => {
    dispatch(fetchRequisitionOrderByIdRequest());
    axios.get(`${BASE_URL}/requisitionOrder/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchRequisitionOrderByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchRequisitionOrderByIdFailure(error));
    });
};


/**
 * 清空请购单reducer数据
 **/
export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});







