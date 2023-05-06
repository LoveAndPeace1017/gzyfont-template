import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取批次查询列表
 **/
const fetchBatchQueryReport = () => ({
    type: constant.FETCH_REPORT_BATCH_QUERY
});
const fetchBatchQueryReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_BATCH_QUERY_SUCCESS,
    data
});
const fetchBatchQueryReportFailure = (error) => ({
    type: constant.FETCH_REPORT_BATCH_QUERY_FAILURE,
    error
});


export const asyncFetchBatchQueryReport = (params, callback) => dispatch => {
    dispatch(fetchBatchQueryReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/batchQuery/batchnumber`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchBatchQueryReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchBatchQueryReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchBatchQueryReportFailure(error));
        });
};


/**
 * 更新配置项
 */
const updateConfig = (data) => ({
    type: constant.TYPE + '_' + 'COMMON_UPDATE_TEMP_CONFIG',
    data
});
export const asyncUpdateConfig = (type, fieldName, propName, index, value) => dispatch => {
    dispatch(updateConfig({
        type, fieldName, propName, index, value
    }));
};
export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);


/**
 * 修改保值期
 **/
const modifyBatchQueryRequest = () => ({
    type: constant.MODIFY_BATCH_QUERY_REQUEST
});

const modifyBatchQuerySuccess = (data) => ({
    type: constant.MODIFY_BATCH_QUERY_SUCCESS,
    data
});

const modifyBatchQueryFailure = (error) => ({
    type: constant.MODIFY_BATCH_QUERY_FAILURE,
    error
});

export const asyncModifyBatchQuery = (values, callback) => dispatch => {
    dispatch(modifyBatchQueryRequest());
    axios.post(`${BASE_URL}/batchQuery/modify`, {
        ...values
    }).then(res => {
        dispatch(modifyBatchQuerySuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(modifyBatchQueryFailure(error));
    })
};


/**
 * 获取修改保值期记录列表
 **/
const fetchBatchModifyList = () => ({
    type: constant.FETCH_BATCH_MODIFY_LIST_REQUEST
});
const fetchBatchModifySuccess = (data) => ({
    type: constant.FETCH_BATCH_MODIFY_LIST_SUCCESS,
    data
});
const fetchBatchModifyFailure = (error) => ({
    type: constant.FETCH_BATCH_MODIFY_LIST_FAILURE,
    error
});

/**
 * 获取修改保值期记录列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchBatchModifyList = (params, callback) => dispatch => {
    dispatch(fetchBatchModifyList());

    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/batchQuery/record/list`, {
        params: {
            page: 1,
            ...params
        }
    }).then(function (res) {
        dispatch(fetchBatchModifySuccess(fromJS(res.data)));
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchBatchModifyFailure(error));
    });
};












