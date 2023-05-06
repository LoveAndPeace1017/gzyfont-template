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

export const asyncFetchOrderNotice = (page = 1, perPage = 10) => dispatch => {
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
    axios.get(`${BASE_URL}/common/friend/message`,{
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