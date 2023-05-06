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
    axios.get(`${BASE_URL}/inventory/scheduling/pre/create`).then(function(res) {
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
const addSchedulingRequest = () => ({
    type: constant.ADD_SCHEDULING_REQUEST
});

const addSchedulingSuccess = (data) => ({
    type: constant.ADD_SCHEDULING_SUCCESS,
    data
});

const addSchedulingFailure = (error) => ({
    type: constant.ADD_SCHEDULING_FAILURE,
    error
});

export const asyncAddScheduling = (id, values, callback) => dispatch => {
    dispatch(addSchedulingRequest());
    let url = `${BASE_URL}/inventory/scheduling/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addSchedulingSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addSchedulingFailure(error));
    })
};


/**
 * 根据销售单id获取销售单信息
 **/
export const fetchSchedulingByIdRequest = () => ({
    type: constant.FETCH_SCHEDULING_BY_ID_REQUEST
});

export const fetchSchedulingByIdSuccess = (data) => ({
    type: constant.FETCH_SCHEDULING_BY_ID_SUCCESS,
    data
});

export const fetchSchedulingByIdFailure = (error) => ({
    type: constant.FETCH_SCHEDULING_BY_ID_FAILURE,
    error
});

export const asyncFetchSchedulingById = (id, callback) => dispatch => {

    dispatch(fetchSchedulingByIdRequest());
    axios.get(`${BASE_URL}/inventory/scheduling/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchSchedulingByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSchedulingByIdFailure(error));
    });
};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});











