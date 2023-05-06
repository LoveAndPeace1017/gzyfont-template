import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 新增收入记录提交
 **/
const addExpendRequest = () => ({
    type: constant.ADD_EXPEND_REQUEST
});

const addExpendSuccess = (data) => ({
    type: constant.ADD_EXPEND_SUCCESS,
    data
});

const addExpendFailure = (error) => ({
    type: constant.ADD_EXPEND_FAILURE,
    error
});

export const asyncAddExpend = (values, callback) => dispatch => {
    dispatch(addExpendRequest());
    let url = `${BASE_URL}/finance/expend/insert`;
    axios.post(url, values).then(res => {
        dispatch(addExpendSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addExpendFailure(error));
    })
};

export const asyncEditExpend = (values, callback) => dispatch => {
    dispatch(addExpendRequest());
    let url = `${BASE_URL}/finance/expend/edit`;
    axios.put(url, {
        ...values
    }).then(res => {
        dispatch(addExpendSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addExpendFailure(error));
    })
};

/**
 * 根据收入记录id获取收入记录信息
 **/
export const fetchExpendByIdRequest = () => ({
    type: constant.FETCH_EXPEND_BY_ID_REQUEST
});

export const fetchExpendByIdSuccess = (data) => ({
    type: constant.FETCH_EXPEND_BY_ID_SUCCESS,
    data
});

export const fetchExpendByIdFailure = (error) => ({
    type: constant.FETCH_EXPEND_BY_ID_FAILURE,
    error
});

export const asyncFetchExpendById = (id, callback) => dispatch => {

    dispatch(fetchExpendByIdRequest());
    axios.get(`${BASE_URL}/finance/expend/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchExpendByIdSuccess(fromJS(res.data)));
            callback && callback(fromJS(res.data));
        }
    }).catch(error => {
        dispatch(fetchExpendByIdFailure(error));
    });
};
