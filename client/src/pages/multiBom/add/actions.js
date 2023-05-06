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
    axios.get(`${BASE_URL}/multiBom/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增多级BOM
 **/
const addMultiBomRequest = () => ({
    type: constant.ADD_MULTI_BOM_REQUEST
});

const addMultiBomSuccess = (data) => ({
    type: constant.ADD_MULTI_BOM_SUCCESS,
    data
});

const addMultiBomFailure = (error) => ({
    type: constant.ADD_MULTI_BOM_FAILURE,
    error
});

export const asyncAddMultiBom = (billNo, values, callback) => dispatch => {
    dispatch(addMultiBomRequest());
    let url = billNo?`${BASE_URL}/multiBom/modify/${billNo}`:`${BASE_URL}/multiBom/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addMultiBomSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addMultiBomFailure(error));
    })
};


/**
 * 根据id获取多级BOM详情
 **/
export const fetchMultiBomByIdRequest = () => ({
    type: constant.FETCH_MULTI_BOM_BY_ID_REQUEST
});

export const fetchMultiBomByIdSuccess = (data) => ({
    type: constant.FETCH_MULTI_BOM_BY_ID_SUCCESS,
    data
});

export const fetchMultiBomByIdFailure = (error) => ({
    type: constant.FETCH_MULTI_BOM_BY_ID_FAILURE,
    error
});

export const asyncFetchMultiBomById = (id, callback) => dispatch => {
    dispatch(fetchMultiBomByIdRequest());
    axios.get(`${BASE_URL}/multiBom/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchMultiBomByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchMultiBomByIdFailure(error));
    });
};


// 通过bomCode访问详情
export const asyncFetchMultiBomByCode =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_FETCH_WORK_SHEET_RECORD_BY_CODE,
    request: axios.get(`${BASE_URL}/multiBom/code/detail`, {params}),
    callback
});


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});










