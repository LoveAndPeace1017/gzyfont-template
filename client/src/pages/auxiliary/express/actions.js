import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取收支列表
 **/
const fetchIncomeListRequest = (incomeType) => ({
    type: constant.FETCH_EXPRESS_LIST_REQUEST,
    incomeType
});

const fetchIncomeListSuccess = (data, incomeType) => ({
    type: constant.FETCH_EXPRESS_LIST_SUCCESS,
    data,
    incomeType
});

const fetchIncomeListFailure = (error, incomeType) => ({
    type: constant.FETCH_EXPRESS_LIST_FAILURE,
    incomeType,
    error
});

export const asyncFetchExpressList = (type, callback) => dispatch => {
    dispatch(fetchIncomeListRequest(type));
    console.log(type);
    console.log('--===---');
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
    type: constant.ADD_EXPRESS_REQUEST
});

const addIncomeSuccess = (data) => ({
    type: constant.ADD_EXPRESS_SUCCESS,
    data
});

const addIncomeFailure = (error) => ({
    type: constant.ADD_EXPRESS_FAILURE,
    error
});

export const asyncAddExpress = (operType, values, callback) => dispatch => {
    dispatch(addIncomeRequest());
    let url = `${BASE_URL}/auxiliary/express/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addIncomeSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addIncomeFailure(error));
    })
};

export const asyncFetchExpressSelectInfo = (callback) => dispatch => {
    let url = `${BASE_URL}/auxiliary/logistic/info`;
    axios.get(url).then(res => {
        callback && callback(res);
    }).catch(error => {
        console.log(error);
    })
};

export const asyncFetchExpressInfoNum = (callback) => dispatch => {
    let url = `${BASE_URL}/auxiliary/logistic/num`;
    axios.get(url).then(res => {
        callback && callback(res);
    }).catch(error => {
        console.log(error);
    })
};

//获取物流详情
export const asyncFetchExpressInfoDetail = (values,callback) => dispatch => {
    let url = `${BASE_URL}/auxiliary/logistic/detail`;
    axios.post(url,values).then(res => {
        callback && callback(res);
    }).catch(error => {
        console.log(error);
    })
};