import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取部门列表
 **/
const fetchCustomFieldListRequest = () => ({
    type: constant.FETCH_CUSTOM_FIELD_LIST_REQUEST
});

const fetchCustomFieldListSuccess = (moduleName,data) => ({
    type: constant.FETCH_CUSTOM_FIELD_LIST_SUCCESS,
    data,
    moduleName
});

const fetchCustomFieldListFailure = (error) => ({
    type: constant.FETCH_CUSTOM_FIELD_LIST_FAILURE,
    error
});

export const asyncFetchCustomFieldList = (type) => dispatch => {
    dispatch(fetchCustomFieldListRequest());
    axios.get(`${BASE_URL}/auxiliary/customField/list`,{
        params: {
            type
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchCustomFieldListSuccess(type,fromJS(res.data)));
        }
    }).catch(error => {
        dispatch(fetchCustomFieldListFailure(error));
    });
};


/**
 * 新增/修改/删除部门提交
 **/
const addCustomFieldRequest = () => ({
    type: constant.ADD_CUSTOM_FIELD_REQUEST
});

const addCustomFieldSuccess = (data) => ({
    type: constant.ADD_CUSTOM_FIELD_SUCCESS,
    data
});

const addCustomFieldFailure = (error) => ({
    type: constant.ADD_CUSTOM_FIELD_FAILURE,
    error
});

export const asyncAddCustomField = (operType,values, callback) => dispatch => {
    dispatch(addCustomFieldRequest());
    let url = `${BASE_URL}/auxiliary/customField/oprate/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addCustomFieldSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addCustomFieldFailure(error));
    })
};