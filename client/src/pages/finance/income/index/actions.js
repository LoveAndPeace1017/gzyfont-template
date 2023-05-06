import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`/api/customer/listStatistics/`).then(function (res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        });
    });
};


/**
 * 获取客户列表数据
 **/
const fetchIncomeList = () => ({
    type: constant.INCOME_LIST
});
const fetchIncomeListSuccess = (data) => ({
    type: constant.INCOME_LIST_SUCCESS,
    data
});
const fetchIncomeListFailure = (error) => ({
    type: constant.INCOME_LIST_FAILURE,
    error
});
/**
 * 获取列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchIncomeList = (params, callback) => dispatch => {
    dispatch(fetchIncomeList());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`/api/finance/income/list`, {params}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchIncomeListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        } else {
            dispatch(fetchIncomeListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchIncomeListFailure(error));
    });
};

// 列表返回带回初始化数据
const filterConfigListSuccess = (data) => ({
    type: constant.FILTER_CONFIG_LIST,
    data
});

export const dealFilterConfigList = (data) => dispatch => {
    dispatch(filterConfigListSuccess(data))
};

/**
 * 删除客户信息
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncDeleteIncomeInfo = (ids, callback) => dispatch => {
    axios.post(`/api/finance/income/delete`, {
        ids: ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
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

/**
 * 批量更新配置项
 */
export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);

/**
 * 获取付款记录
 * @param params
 * @returns {Function}
 */

const fetchIncomeRecordRequest = () => ({
    type: constant.FETCH_INCOME_RECORD_REQUEST
});
const fetchIncomeRecordSuccess = (data) => ({
    type: constant.FETCH_INCOME_RECORD_SUCCESS,
    data
});
const fetchIncomeRecordFailure = () => ({
    type: constant.FETCH_INCOME_RECORD_FAILURE
});

export const asyncFetchIncomeRecord = ({type, recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchIncomeRecordRequest());
    axios.get(`/api/finance/income/record`,{
        params: {
            type,
            recordFor,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchIncomeRecordSuccess(res.data));

        }else{
            dispatch(fetchIncomeRecordFailure());
        }

        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchIncomeRecordFailure(error));
    });
};



