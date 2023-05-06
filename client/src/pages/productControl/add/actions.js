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
    axios.get(`${BASE_URL}/productControl/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};

/**
 * 根据bomcode获取工序列表
 **/
export const asyncFetchProcessListByBomCode = (params,callback) => dispatch => {
    axios.post(`${BASE_URL}/productControl/process/bomcode`,params).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
       console.log(error);
    });
};


/**
 * 新增工单
 **/
const addProductControlRequest = () => ({
    type: constant.ADD_PRODUCT_CONTROL_REQUEST
});

const addProductControlSuccess = (data) => ({
    type: constant.ADD_PRODUCT_CONTROL_SUCCESS,
    data
});

const addProductControlFailure = (error) => ({
    type: constant.ADD_PRODUCT_CONTROL_FAILURE,
    error
});

export const asyncAddProductControl = (billNo, values, callback) => dispatch => {
    dispatch(addProductControlRequest());
    let url = billNo?`${BASE_URL}/productControl/modify/${billNo}`:`${BASE_URL}/productControl/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addProductControlSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addProductControlFailure(error));
    })
};


/**
 * 根据id获取工单信息
 **/
export const fetchProductControlByIdRequest = () => ({
    type: constant.FETCH_PRODUCT_CONTROL_BY_ID_REQUEST
});

export const fetchProductControlByIdSuccess = (data) => ({
    type: constant.FETCH_PRODUCT_CONTROL_BY_ID_SUCCESS,
    data
});

export const fetchProductControlByIdFailure = (error) => ({
    type: constant.FETCH_PRODUCT_CONTROL_BY_ID_FAILURE,
    error
});

export const asyncFetchProductControlById = (id, callback) => dispatch => {
    dispatch(fetchProductControlByIdRequest());
    axios.get(`${BASE_URL}/productControl/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchProductControlByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchProductControlByIdFailure(error));
    });
};

/**
 * 根据 key 获取工序列表
 **/
const fetchProcessListByKeyRequest = (key) => ({
    type: constant.FETCH_PROCESS_LIST_REQUEST,
    key
});
const fetchProcessListByKeySuccess = (key, data) => ({
    type: constant.FETCH_PROCESS_LIST_SUCCESS,
    key,
    data
});
const fetchProcessListByKeyFailure = (key, error) => ({
    type: constant.FETCH_PROCESS_LIST_FAILURE,
    key,
    error
});

export const asyncFetchProcessListByKey = (key, flag, callback) => dispatch => {
    dispatch(fetchProcessListByKeyRequest(key));
    axios.get(`${BASE_URL}/productControl/search/by/field`,{
        params: {
            key, flag
        }
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchProcessListByKeySuccess(key, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchProcessListByKeyFailure(key, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchProcessListByKeyFailure(error));
    });
};



export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});










