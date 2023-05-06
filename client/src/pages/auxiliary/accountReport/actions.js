import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取报工账户列表
 **/
const fetchAccountReportListRequest = () => ({
    type: constant.FETCH_ACCOUNT_REPORT_LIST_REQUEST
});

const fetchAccountReportListSuccess = (data) => ({
    type: constant.FETCH_ACCOUNT_REPORT_LIST_SUCCESS,
    data
});

const fetchAccountReportListFailure = (error) => ({
    type: constant.FETCH_ACCOUNT_REPORT_LIST_FAILURE,
    error
});

export const asyncFetchAccountReportList = (params, callback) => dispatch => {
    dispatch(fetchAccountReportListRequest());
    axios.post(`${BASE_URL}/auxiliary/accountreport/list`, {params}).then(function(res) {
        if (res.data) {
            dispatch(fetchAccountReportListSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchAccountReportListFailure(error));
    });
};

/**
 * 新增/修改/删除报工账户
 **/
const addAccountReportRequest = () => ({
    type: constant.ADD_ACCOUNT_REPORT_REQUEST
});

const addAccountReportSuccess = (data) => ({
    type: constant.ADD_ACCOUNT_REPORT_SUCCESS,
    data
});

const addAccountReportFailure = (error) => ({
    type: constant.ADD_ACCOUNT_REPORT_FAILURE,
    error
});

export const asyncAddAccountReport = (type,values, callback) => dispatch => {
    dispatch(addAccountReportRequest());
    let url = `${BASE_URL}/auxiliary/accountReport/oprate/${type}`;
    axios.post(url, values).then(res => {
        dispatch(addAccountReportSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addAccountReportFailure(error));
    })
};



