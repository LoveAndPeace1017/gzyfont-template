import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取分组列表
 **/
const fetchGroupListRequest = (groupType) => ({
    type: constant.FETCH_GROUP_LIST_REQUEST,
    groupType
});

const fetchGroupListSuccess = (data, groupType) => ({
    type: constant.FETCH_GROUP_LIST_SUCCESS,
    data,
    groupType
});

const fetchGroupListFailure = (error, groupType) => ({
    type: constant.FETCH_GROUP_LIST_FAILURE,
    groupType,
    error
});

export const asyncFetchGroupList = (type, callback) => dispatch => {
    dispatch(fetchGroupListRequest(type));
    axios.get(`${BASE_URL}/auxiliary/${type}/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchGroupListSuccess(fromJS(res.data), type));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchGroupListFailure(error, type));
    });
};


/**
 * 新增/修改/删除分组
 **/
const addGroupRequest = () => ({
    type: constant.ADD_GROUP_REQUEST
});

const addGroupSuccess = (data) => ({
    type: constant.ADD_GROUP_SUCCESS,
    data
});

const addGroupFailure = (error) => ({
    type: constant.ADD_GROUP_FAILURE,
    error
});

export const asyncAddGroup = (operType, type, values, callback) => dispatch => {
    dispatch(addGroupRequest());
    let url = `${BASE_URL}/auxiliary/${type}/oprate/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addGroupSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addGroupFailure(error));
    })
};