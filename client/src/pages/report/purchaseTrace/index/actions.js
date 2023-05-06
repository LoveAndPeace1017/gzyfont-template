import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchPurchaseTraceDetailReport = () => ({
    type: constant.FETCH_REPORT_PURCHASE_TRACE_DETAIL
});
const fetchPurchaseTraceDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_PURCHASE_TRACE_DETAIL_SUCCESS,
    data
});
const fetchPurchaseTraceDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_PURCHASE_TRACE_DETAIL_FAILURE,
    error
});


export const asyncFetchPurchaseTraceDetailReport = (params, callback) => dispatch => {
    dispatch(fetchPurchaseTraceDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/purchaseTrace/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchPurchaseTraceDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchPurchaseTraceDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchPurchaseTraceDetailReportFailure(error));
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
