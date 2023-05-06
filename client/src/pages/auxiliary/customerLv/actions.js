import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取客户级别列表
 **/
const fetchCustomerLvListRequest = () => ({
    type: constant.FETCH_CUSTOMER_LV_LIST_REQUEST
});

const fetchCustomerLvListSuccess = (data) => ({
    type: constant.FETCH_CUSTOMER_LV_LIST_SUCCESS,
    data
});

const fetchCustomerLvListFailure = (error) => ({
    type: constant.FETCH_CUSTOMER_LV_LIST_FAILURE,
    error
});

export const asyncFetchCustomerLvList = (callback) => dispatch => {
    dispatch(fetchCustomerLvListRequest());
    axios.get(`${BASE_URL}/auxiliary/customerLv/list`).then(function(res) {
        if (res.data) {
            dispatch(fetchCustomerLvListSuccess(fromJS(res.data.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchCustomerLvListFailure(error));
    });
};

/**
 * 新增/修改/删除项目提交
 **/
const addCustomerLvRequest = () => ({
    type: constant.ADD_CUSTOMER_LV_REQUEST
});

const addCustomerLvSuccess = (data) => ({
    type: constant.ADD_CUSTOMER_LV_SUCCESS,
    data
});

const addCustomerLvFailure = (error) => ({
    type: constant.ADD_CUSTOMER_LV_FAILURE,
    error
});

export const asyncAddCustomerLv = (type, values, callback) => dispatch => {
    dispatch(addCustomerLvRequest());
    let url = `${BASE_URL}/auxiliary/customerLv/oprate/${type}`;
    axios.post(url, values).then(res => {
        dispatch(addCustomerLvSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addCustomerLvFailure(error));
    })
};

export const asyncCheckName = (params, callback, errorCallback) => dispatch => {
    axios.get(`${BASE_URL}/auxiliary/checkName/`, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        errorCallback && errorCallback(error)
    })
};

