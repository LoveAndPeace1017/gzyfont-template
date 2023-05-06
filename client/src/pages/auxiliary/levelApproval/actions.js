import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取多级审批列表
 **/
const fetchLevelApprovedListRequest = () => ({
    type: constant.FETCH_LEVEL_APPROVED_LIST_REQUEST,
});

const fetchLevelApprovedListSuccess = (data) => ({
    type: constant.FETCH_LEVEL_APPROVED_LIST_SUCCESS,
    data
});

const fetchLevelApprovedListFailure = (error) => ({
    type: constant.FETCH_LEVEL_APPROVED_LIST_FAILURE,
    error
});

export const asyncFetchLevelApprovedList = (values,callback) => dispatch => {
    dispatch(fetchLevelApprovedListRequest());

    axios.post(`${BASE_URL}/approve/list`,values).then(function(res) {
        if (res.data) {
            dispatch(fetchLevelApprovedListSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchLevelApprovedListFailure(error));
    });
};


/**
 * 新增/修改/删除收支提交
 **/
const addLevelApprovedRequest = () => ({
    type: constant.ADD_LEVEL_APPROVED_REQUEST
});

const addLevelApprovedSuccess = (data) => ({
    type: constant.ADD_LEVEL_APPROVED_SUCCESS,
    data
});

export const emptyDetailData = () => ({
    type: constant.FETCH_LEVEL_APPROVED_LIST_EMPTY
});


const addLevelApprovedFailure = (error) => ({
    type: constant.ADD_LEVEL_APPROVED_FAILURE,
    error
});

export const asyncDeleteLevelApproved = (values, callback) => dispatch => {
    dispatch(addLevelApprovedRequest());
    let url = `${BASE_URL}/approve/delete/`;
    axios.post(url,values).then(res => {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    })
};

export const asyncDetailLevelApproved = (values, callback) => dispatch => {
    dispatch(addLevelApprovedRequest());
    let url = `${BASE_URL}/approve/detail/`;
    axios.post(url,values).then(res => {
        dispatch(addLevelApprovedSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        alert(error);
    })
};

export const asyncAddLevelApproved = (values, callback) => dispatch => {
    dispatch(addLevelApprovedRequest());
    let url = `${BASE_URL}/approve/process/`;
    axios.post(url,values).then(res => {
        callback && callback(res.data);
    }).catch(error => {
        alert(error);
    })
};