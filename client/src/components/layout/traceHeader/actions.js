import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';


/**
 * 订单通知
 **/
const fetchOrderNoticeRequest = () => ({
    type: constant.FETCH_ORDER_NOTICE_REQUEST
});

const fetchOrderNoticeSuccess = (data) => ({
    type: constant.FETCH_ORDER_NOTICE_SUCCESS,
    data
});

const fetchOrderNoticeFailure = (error) => ({
    type: constant.FETCH_ORDER_NOTICE_FAILURE,
    error
});

export const asyncFetchOrderNotice = (page = 1, perPage = 20) => dispatch => {
    dispatch(fetchOrderNoticeRequest());
    axios.get(`${BASE_URL}/home/ads/2`,{
        params: {
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchOrderNoticeSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchOrderNoticeFailure(error));
    });
};

/**
 * 好友通知
 **/
const fetchFriendNoticeRequest = () => ({
    type: constant.FETCH_FRIEND_NOTICE_REQUEST
});

const fetchFriendNoticeSuccess = (data, page) => ({
    type: constant.FETCH_FRIEND_NOTICE_SUCCESS,
    data,
    page
});

const fetchFriendNoticeFailure = (error) => ({
    type: constant.FETCH_FRIEND_NOTICE_FAILURE,
    error
});

export const asyncFetchFriendNotice = (page = 1, perPage = 10) => dispatch => {
    dispatch(fetchFriendNoticeRequest());
    axios.get(`${BASE_URL}/notify/list`,{
        params: {
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchFriendNoticeSuccess(fromJS(res.data), page))
        }
    }).catch(error => {
        dispatch(fetchFriendNoticeFailure(error));
    });
};


/**
 * 获取消息数量
 **/
const fetchNoticeCountRequest = () => ({
    type: constant.FETCH_NOTICE_COUNT_REQUEST
});

const fetchNoticeCountSuccess = (data) => ({
    type: constant.FETCH_NOTICE_COUNT_SUCCESS,
    data
});

const fetchNoticeCountFailure = (error) => ({
    type: constant.FETCH_NOTICE_COUNT_FAILURE,
    error
});

export const asyncFetchNoticeCount = (callback) => dispatch => {
    dispatch(fetchNoticeCountRequest());
    axios.get(`${BASE_URL}/notify/count`,{
        params:{
            read: 'no'
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchNoticeCountSuccess(fromJS(res.data)))
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchNoticeCountFailure(error));
    });
};


/**
 * 商城消息置为已读
 **/
const setNoticeReadRequest = (id) => ({
    type: constant.SET_NOTICE_READ_REQUEST,
    id
});

const setNoticeReadSuccess = (id) => ({
    type: constant.SET_NOTICE_READ_SUCCESS,
    id
});

const setNoticeReadFailure = (id,error) => ({
    type: constant.SET_NOTICE_READ_FAILURE,
    id,
    error
});

export const asyncSetNoticeRead = (id, callback) => dispatch => {
    dispatch(setNoticeReadRequest(id));
    axios.put(`${BASE_URL}/notify/read`,{
        id,
        read: 'yes'
    }).then(function(res) {
        if (res.data) {
            dispatch(setNoticeReadSuccess(id, fromJS(res.data)))
            callback && callback(res.data)
        }
    }).catch(error => {
        dispatch(setNoticeReadFailure(id, error));
    });
};