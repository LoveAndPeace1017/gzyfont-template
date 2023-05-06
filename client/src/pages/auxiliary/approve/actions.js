import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取审批列表
 **/
const fetchApproveListRequest = (isBackLoading) => ({
    type: constant.FETCH_APPROVE_LIST_REQUEST,
    isBackLoading
});

const fetchApproveListSuccess = (data) => ({
    type: constant.FETCH_APPROVE_LIST_SUCCESS,
    data
});

const fetchApproveListFailure = (error) => ({
    type: constant.FETCH_APPROVE_LIST_FAILURE,
    error
});

export const asyncFetchApproveList = (isBackLoading=false, callback) => dispatch => {
    dispatch(fetchApproveListRequest(isBackLoading));
    axios.get(`${BASE_URL}/auxiliary/approve/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchApproveListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchApproveListFailure(error));
    });
};


/**
 * 检查业务单据是否已全部审核
 **/
const checkApproveRequest = (key) => ({
    type: constant.CHECK_APPROVE_REQUEST,
    key
});

const checkApproveSuccess = (key) => ({
    type: constant.CHECK_APPROVE_SUCCESS,
    key
});

const checkApproveFailure = (key, error) => ({
    type: constant.CHECK_APPROVE_FAILURE,
    key,
    error
});

export const asyncCheckApprove = (key, item, callback) => dispatch => {
    dispatch(checkApproveRequest(key));
    let url = `${BASE_URL}/auxiliary/check/approve`;
    axios.post(url,{
        ...item
    }).then(res => {
        dispatch(checkApproveSuccess(key));
        callback && callback(fromJS(res.data));
    }).catch(error => {
        dispatch(checkApproveFailure(key, error));
    })
};

/**
 * 启用/停用审批
 **/
const toggleEnableRequest = (key) => ({
    type: constant.TOGGLE_ENABLE_REQUEST,
    key
});

const toggleEnableSuccess = (key) => ({
    type: constant.TOGGLE_ENABLE_SUCCESS,
    key
});

const toggleEnableFailure = (key, error) => ({
    type: constant.TOGGLE_ENABLE_FAILURE,
    key,
    error
});

export const asyncToggleEnable = ({type, key, item}, callback) => dispatch => {
    dispatch(toggleEnableRequest(key));
    let url = `${BASE_URL}/auxiliary/set/approve`;
    axios.post(url,{
        ...item,
        type
    }).then(res => {
        dispatch(toggleEnableSuccess(key));
        callback && callback(fromJS(res.data));
    }).catch(error => {
        dispatch(toggleEnableFailure(key, error));
    })
};

//提交撤回权限
export const asyncWithdraw = (params, callback) => dispatch => {
    let url = `${BASE_URL}/auxiliary/set/withdraw`;
    axios.post(url,params).then(res => {
        callback && callback(res.data);
    }).catch(error => {
        console.log(error);
    })
};

//撤回权限详情
export const asyncWithdrawDetail = (params, callback) => dispatch => {
    let url = `${BASE_URL}/auxiliary/set/withdraw/detail`;
    axios.post(url,params).then(res => {
        callback && callback(res.data);
    }).catch(error => {
        console.log(error);
    })
};
