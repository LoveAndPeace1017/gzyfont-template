import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 新增收入记录提交
 **/
const addIncomeRequest = () => ({
    type: constant.ADD_INCOME_REQUEST
});

const addIncomeSuccess = (data) => ({
    type: constant.ADD_INCOME_SUCCESS,
    data
});

const addIncomeFailure = (error) => ({
    type: constant.ADD_INCOME_FAILURE,
    error
});

export const asyncAddIncome = (values, callback) => dispatch => {
    dispatch(addIncomeRequest());
    let url = `${BASE_URL}/finance/income/insert`;
    axios.post(url, values).then(res => {
        dispatch(addIncomeSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addIncomeFailure(error));
    })
};

export const asyncEditIncome = (values, callback) => dispatch => {
    dispatch(addIncomeRequest());
    let url = `${BASE_URL}/finance/income/edit`;
    axios.put(url, {
        ...values
    }).then(res => {
        dispatch(addIncomeSuccess(res.data));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addIncomeFailure(error));
    })
};

/**
 * 根据收入记录id获取收入记录信息
 **/
export const fetchIncomeByIdRequest = () => ({
    type: constant.FETCH_INCOME_BY_ID_REQUEST
});

export const fetchIncomeByIdSuccess = (data) => ({
    type: constant.FETCH_INCOME_BY_ID_SUCCESS,
    data
});

export const fetchIncomeByIdFailure = (error) => ({
    type: constant.FETCH_INCOME_BY_ID_FAILURE,
    error
});

export const asyncFetchIncomeById = (id, callback) => dispatch => {

    dispatch(fetchIncomeByIdRequest());
    axios.get(`${BASE_URL}/finance/income/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchIncomeByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchIncomeByIdFailure(error));
    });
};
