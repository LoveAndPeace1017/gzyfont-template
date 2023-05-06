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
 * 获取列表数据
 **/
const fetchExpendList = () => ({
    type: constant.EXPAND_LIST
});
const fetchExpendListSuccess = (data) => ({
    type: constant.EXPAND_LIST_SUCCESS,
    data
});
const fetchExpendListFailure = (error) => ({
    type: constant.EXPAND_LIST_FAILURE,
    error
});
/**
 * 获取列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchExpendList = (params, callback) => dispatch => {
    dispatch(fetchExpendList());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`/api/finance/expend/list`, {params}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchExpendListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        } else {
            dispatch(fetchExpendListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchExpendListFailure(error));
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
 * 获取付款记录
 * @param params
 * @returns {Function}
 */

const fetchExpendRecordRequest = () => ({
    type: constant.FETCH_EXPEND_RECORD_REQUEST
});
const fetchExpendRecordSuccess = (data) => ({
    type: constant.FETCH_EXPEND_RECORD_SUCCESS,
    data
});
const fetchExpendRecordFailure = () => ({
    type: constant.FETCH_EXPEND_RECORD_FAILURE
});

export const asyncFetchExpendRecord = ({type, recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchExpendRecordRequest());
    axios.get(`/api/finance/expend/record`, {
        params: {
            type,
            recordFor,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchExpendRecordSuccess(res.data));
        }else{
            dispatch(fetchExpendRecordFailure());
        }

        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchExpendRecordFailure(error));
    });
};

/**
 * 删除付款记录信息
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncDeleteExpendInfo = (ids, callback) => dispatch => {
    axios.post(`/api/finance/expend/delete`, {
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
 * 联想选择
 **/
// export const fetchExpendByValRequest = () => ({
//     type: constant.FETCH_EXPAND_BY_VAL_REQUEST
// });
//
// export const fetchExpendByValSuccess = (data) => ({
//     type: constant.FETCH_EXPAND_BY_VAL_SUCCESS,
//     data
// });
//
// export const fetchExpendByValFailure = (error) => ({
//     type: constant.FETCH_EXPAND_BY_VAL_FAILURE,
//     error
// });
//
//
// let timeout;
// let currentValue;
// export const asyncFetchExpendByVal = (value, callback) => dispatch => {
//
//     dispatch(fetchExpendByValRequest());
//
//     if (timeout) {
//         clearTimeout(timeout);
//         timeout = null;
//     }
//     currentValue = value;
//
//     function fake() {
//         axios.get(`${BASE_URL}/customer/search/by/name/`, {
//             params: {
//                 key: value,
//                 searchType: 'like'
//             }
//         }).then(function (res) {
//             if (res.data) {
//                 dispatch(fetchExpendByValSuccess(fromJS(res.data)));
//                 callback && callback(fromJS(res.data.data));
//             }
//         }).catch(error => {
//             dispatch(fetchExpendByValFailure(error));
//         });
//     }
//
//     timeout = setTimeout(fake, 300);
//
// };



