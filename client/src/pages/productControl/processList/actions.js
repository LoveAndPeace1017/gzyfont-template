import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';


/**
 * 获取工序列表数据
 **/
const fetchProcessList = () => ({
    type: constant.FETCH_PROCESS_LIST_REQUEST
});
const fetchProcessListSuccess = (data) => ({
    type: constant.FETCH_PROCESS_LIST_SUCCESS,
    data
});
const fetchProcessListFailure = (error) => ({
    type: constant.FETCH_PROCESS_LIST_FAILURE,
    error
});

/**
 * 获取工序列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchProcessList = (params, callback) => dispatch => {
    dispatch(fetchProcessList());

    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/productControl/process/list`, {
        params: {
            page: 1,
            ...params
        }
    }).then(function (res) {
        dispatch(fetchProcessListSuccess(fromJS(res.data)));
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchProcessListFailure(error));
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


export const asyncDeleteProcessInfo = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/productControl/process/delete`, params).then(function (res) {
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

export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);