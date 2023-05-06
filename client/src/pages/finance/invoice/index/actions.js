import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';
// export const asyncFetchStatistic = (callback) => dispatch => {
//     axios.get(`/api/customer/listStatistics/`).then(function (res) {
//         callback(res.data);
//     }).catch(error => {
//         callback({
//             retCode: 1,
//             retMsg: error
//         });
//     });
// };


/**
 * 获取客户列表数据
 **/
const fetchInvoiceList = () => ({
    type: constant.INVOICE_LIST
});
const fetchInvoiceListSuccess = (data) => ({
    type: constant.INVOICE_LIST_SUCCESS,
    data
});
const fetchInvoiceListFailure = (error) => ({
    type: constant.INVOICE_LIST_FAILURE,
    error
});
/**
 * 获取列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchInvoiceList = (params, callback) => dispatch => {
    dispatch(fetchInvoiceList());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`/api/finance/invoices/list`, {params}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchInvoiceListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        } else {
            dispatch(fetchInvoiceListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchInvoiceListFailure(error));
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
export const asyncDeleteInvoiceInfo = (ids, callback) => dispatch => {
    axios.post(`/api/finance/invoices/delete`, {
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
 * 获取到票记录
 * @param params
 * @returns {Function}
 */

const fetchInvoiceRecordRequest = () => ({
    type: constant.FETCH_INVOICE_RECORD_REQUEST
});
const fetchInvoiceRecordSuccess = (data) => ({
    type: constant.FETCH_INVOICE_RECORD_SUCCESS,
    data
});
const fetchInvoiceRecordFailure = () => ({
    type: constant.FETCH_INVOICE_RECORD_FAILURE
});

export const asyncFetchInvoiceRecord = ({type, recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchInvoiceRecordRequest());
    axios.get(`/api/finance/invoice/record`, {
        params: {
            type,
            recordFor,
            page,
            perPage
        }
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchInvoiceRecordSuccess(res.data));
        } else {
            dispatch(fetchInvoiceRecordFailure());
        }

        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchInvoiceRecordFailure(error));
    });
};