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
const fetchSaleInvoiceList = () => ({
    type: constant.SALEINVOICE_LIST
});
const fetchSaleInvoiceListSuccess = (data) => ({
    type: constant.SALEINVOICE_LIST_SUCCESS,
    data
});
const fetchSaleInvoiceListFailure = (error) => ({
    type: constant.SALEINVOICE_LIST_FAILURE,
    error
});
/**
 * 获取列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchSaleInvoiceList = (params, callback) => dispatch => {
    dispatch(fetchSaleInvoiceList());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`/api/finance/saleinvoices/list`, {params}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchSaleInvoiceListSuccess(fromJS(res.data)));
            callback && callback(res.data);
        } else {
            dispatch(fetchSaleInvoiceListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchSaleInvoiceListFailure(error));
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
export const asyncDeleteSaleInvoiceInfo = (ids, callback) => dispatch => {
    axios.post(`/api/finance/saleinvoices/delete`, {
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
 * 获取开票记录
 * @param params
 * @returns {Function}
 */

const fetchSaleInvoiceRecordRequest = () => ({
    type: constant.FETCH_SALEINVOICE_RECORD_REQUEST
});
const fetchSaleInvoiceRecordSuccess = (data) => ({
    type: constant.FETCH_SALEINVOICE_RECORD_SUCCESS,
    data
});
const fetchSaleInvoiceRecordFailure = () => ({
    type: constant.FETCH_SALEINVOICE_RECORD_FAILURE
});

export const asyncFetchSaleInvoiceRecord = ({type, recordFor, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchSaleInvoiceRecordRequest());
    axios.get(`/api/finance/saleinvoice/record`,{
        params: {
            type,
            recordFor,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSaleInvoiceRecordSuccess(res.data));

        }else{
            dispatch(fetchSaleInvoiceRecordFailure());
        }

        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSaleInvoiceRecordFailure(error));
    });
};



