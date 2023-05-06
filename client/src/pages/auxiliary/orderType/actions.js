import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取收支列表
 **/
const fetchIncomeListRequest = (incomeType) => ({
    type: constant.FETCH_ORDERTYPE_LIST_REQUEST,
    incomeType
});

const fetchIncomeListSuccess = (data, incomeType) => ({
    type: constant.FETCH_ORDERTYPE_LIST_SUCCESS,
    data,
    incomeType
});

const fetchIncomeListFailure = (error, incomeType) => ({
    type: constant.FETCH_ORDERTYPE_LIST_FAILURE,
    incomeType,
    error
});

export const asyncFetchPayList = (type, callback) => dispatch => {
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
 * 新增/修改/删除收支提交
 **/
const addIncomeRequest = () => ({
    type: constant.ADD_ORDERTYPE_REQUEST
});

const addIncomeSuccess = (data) => ({
    type: constant.ADD_ORDERTYPE_SUCCESS,
    data
});

const addIncomeFailure = (error) => ({
    type: constant.ADD_ORDERTYPE_FAILURE,
    error
});

export const asyncAddPay = (operType, values, callback) => dispatch => {
    dispatch(addIncomeRequest());
    let url = `${BASE_URL}/auxiliary/orderType/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addIncomeSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addIncomeFailure(error));
    })
};