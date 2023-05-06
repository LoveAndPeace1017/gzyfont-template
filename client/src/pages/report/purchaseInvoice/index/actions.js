import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购到票报表信息
 **/
const fetchPurchaseInvoiceDetailReport = () => ({
    type: constant.FETCH_REPORT_PI_DETAIL
});
const fetchPurchaseInvoiceDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_PI_DETAIL_SUCCESS,
    data
});
const fetchPurchaseInvoiceDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_PI_DETAIL_FAILURE,
    error
});


export const asyncFetchPurchaseInvoiceDetailReport = (params, callback) => dispatch => {
    dispatch(fetchPurchaseInvoiceDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/purchaseInvoice/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchPurchaseInvoiceDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchPurchaseInvoiceDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchPurchaseInvoiceDetailReportFailure(error));
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
