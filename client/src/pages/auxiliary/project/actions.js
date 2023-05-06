import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取项目列表
 **/
const fetchProjectListRequest = () => ({
    type: constant.FETCH_PROJECT_LIST_REQUEST
});

const fetchProjectListSuccess = (data) => ({
    type: constant.FETCH_PROJECT_LIST_SUCCESS,
    data
});

const fetchProjectListFailure = (error) => ({
    type: constant.FETCH_PROJECT_LIST_FAILURE,
    error
});

export const asyncFetchProjectList = (params, callback) => dispatch => {
    dispatch(fetchProjectListRequest());
    axios.get(`${BASE_URL}/auxiliary/project/list`, {params}).then(function(res) {
        if (res.data) {
            dispatch(fetchProjectListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchProjectListFailure(error));
    });
};

/**
 * 新增/修改/删除项目提交
 **/
const addProjectRequest = () => ({
    type: constant.ADD_PROJECT_REQUEST
});

const addProjectSuccess = (data) => ({
    type: constant.ADD_PROJECT_SUCCESS,
    data
});

const addProjectFailure = (error) => ({
    type: constant.ADD_PROJECT_FAILURE,
    error
});

export const asyncAddProject = (type,values, callback) => dispatch => {
    dispatch(addProjectRequest());
    let url = `${BASE_URL}/auxiliary/project/oprate/${type}`;
    axios.post(url, values).then(res => {
        dispatch(addProjectSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addProjectFailure(error));
    })
};

export const asyncCheckName = (params, callback, errorCallback) => dispatch => {
    axios.get(`${BASE_URL}/auxiliary/checkName/`, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        errorCallback && errorCallback(error)
    })
};


/**
 * 隐藏或显示项目
 **/
const visibleProjectRequest = () => ({
    type: constant.VISIBLE_PROJECT_REQUEST
});

const visibleProjectSuccess = (data) => ({
    type: constant.VISIBLE_PROJECT_SUCCESS,
    data
});

const visibleProjectFailure = (error) => ({
    type: constant.VISIBLE_PROJECT_FAILURE,
    error
});

export const asyncVisibleProject = (params, callback) => dispatch => {
    dispatch(visibleProjectRequest());
    let url = `${BASE_URL}/auxiliary/project/visible`;
    axios.post(url, params).then(res => {
        dispatch(visibleProjectSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(visibleProjectFailure(error));
    })
};
