import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取收支列表
 **/
const fetchIncomeListRequest = (incomeType) => ({
    type: constant.FETCH_ADDRESS_LIST_REQUEST,
    incomeType
});

const fetchIncomeListSuccess = (data, incomeType) => ({
    type: constant.FETCH_ADDRESS_LIST_SUCCESS,
    data,
    incomeType
});

const fetchIncomeListFailure = (error, incomeType) => ({
    type: constant.FETCH_ADDRESS_LIST_FAILURE,
    incomeType,
    error
});

export const asyncFetchAddressList = (type, callback) => dispatch => {
    dispatch(fetchIncomeListRequest(type));
    axios.get(`${BASE_URL}/auxiliary/${type}/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchIncomeListSuccess(fromJS(res.data), type));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchIncomeListFailure(error, type));
    });
};

/**
 * 更改地址常用项
 **/
export const asyncEditCommon = (id, callback) => dispatch => {
    axios.get(`${BASE_URL}/auxiliary/address/editCommon?id=${id}`).then(function(res) {
        if (res.data) {
            callback && callback(res);
        }
    }).catch(error => {

    });
}


/**
 * 新增/修改/删除收支提交
 **/
const addIncomeRequest = () => ({
    type: constant.ADD_ADDRESS_REQUEST
});

const addIncomeSuccess = (data) => ({
    type: constant.ADD_ADDRESS_SUCCESS,
    data
});

const addIncomeFailure = (error) => ({
    type: constant.ADD_ADDRESS_FAILURE,
    error
});

export const asyncAddAddress = (operType, values, callback) => dispatch => {
    dispatch(addIncomeRequest());
    let url = `${BASE_URL}/auxiliary/address/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addIncomeSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addIncomeFailure(error));
    })
};