import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 获取子账号列表数据
 **/
const fetchSubAccountListRequest = () => ({
    type: constant.FETCH_SUB_ACCOUNT_LIST_REQUEST
});

const fetchSubAccountListSuccess = (data) => ({
    type: constant.FETCH_SUB_ACCOUNT_LIST_SUCCESS,
    data
});

const fetchSubAccountListFailure = (error) => ({
    type: constant.FETCH_SUB_ACCOUNT_LIST_FAILURE,
    error
});

export const asyncFetchSubAccountList = (getUrl,callback) => dispatch => {
    /**
     * getUrl，存在则为获取已分配的子账号列表，否则就是获取子账号列表
     **/
    dispatch(fetchSubAccountListRequest());
    let url;
    url = getUrl ? `${BASE_URL}${getUrl}` : `${BASE_URL}/subAccount/list`;
    axios.get(url).then(function(res) {
        if (res.data) {
            console.log(res.data, 'res.data');
            dispatch(fetchSubAccountListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSubAccountListFailure(error));
    });
};


/**
 * 获取切换账号列表数据
 **/
const fetchSwitchAccountListRequest = () => ({
    type: constant.FETCH_SWITCH_ACCOUNT_LIST_REQUEST
});

const fetchSwitchAccountListSuccess = (data) => ({
    type: constant.FETCH_SWITCH_ACCOUNT_LIST_SUCCESS,
    data
});

const fetchSwitchAccountListFailure = (error) => ({
    type: constant.FETCH_SWITCH_ACCOUNT_LIST_FAILURE,
    error
});

export const asyncFetchSwitchAccountList = (getUrl) => dispatch => {
    dispatch(fetchSwitchAccountListRequest());
    axios.get(`${BASE_URL}/subAccount/list`).then(function(res) {
        if (res.data) {
            dispatch(fetchSwitchAccountListSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchSwitchAccountListFailure(error));
    });
};

/**
 * 停用/启用
 **/
const fetchUserStatusRequest = (userId) => ({
    type: constant.FETCH_USER_STATUS_REQUEST,
    userId
});

const fetchUserStatusSuccess = (userId) => ({
    type: constant.FETCH_USER_STATUS_SUCCESS,
    userId
});

const fetchUserStatusFailure = (userId) => ({
    type: constant.FETCH_USER_STATUS_FAILURE,
    userId
});

export const asyncFetchUserStatus = (userId, type) => dispatch => {
    dispatch(fetchUserStatusRequest(userId));
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/subAccount/oprate/${type}`, {
            subUserId: userId
        }).then(res => {
            dispatch(fetchUserStatusSuccess(userId));
            resolve(res);
        }).catch(error => {
            dispatch(fetchUserStatusFailure(userId));
            reject(error);
        })
    })
};

//主账号分配用户
export const asyncFetchMainToSub = (value) => dispatch => {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/subAccount/mainRelationEmployee/`, {
            value
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error);
        })
    })
};

//主账号取绑定的员工和部门
export const asyncFetchInfoByMainAccount = () => dispatch => {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/subAccount/mainInfoAboutEmployee/`).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error);
        })
    })
};

//把仓库分配给子账号
const assignToSubAccountRequest = () => ({
    type: constant.ASSIGN_TO_SUB_ACCOUNT_REQUEST
});

const assignToSubAccountSuccess = (data) => ({
    type: constant.ASSIGN_TO_SUB_ACCOUNT_SUCCESS,
    data
});

const assignToSubAccountFailure = (error) => ({
    type: constant.ASSIGN_TO_SUB_ACCOUNT_FAILURE,
    error
});

// 分配客户给子账号提交
export const asyncAssignToSubAccount = (url, list, callback) => dispatch => {
    dispatch(assignToSubAccountRequest());
    axios.post(`${BASE_URL}${url}`, {
        list
    }).then(res => {
        dispatch(assignToSubAccountSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(assignToSubAccountFailure(error));
    })
};

// 批量分配客户给子账号提交
export const asyncBatchAssignToSubAccount = (url, params, callback) => dispatch => {
    dispatch(assignToSubAccountRequest());
    axios.post(`${BASE_URL}${url}`, params).then(res => {
        dispatch(assignToSubAccountSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(assignToSubAccountFailure(error));
    })
};

export const emptySubAccountList = () => ({
    type: constant.EMPTY_SUB_ACCOUNT_LIST
});

export const subAccountCheck = (selectedRowKeys) => ({
    type: constant.SUB_ACCOUNT_CHECK,
    selectedRowKeys
});




