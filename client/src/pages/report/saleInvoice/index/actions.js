import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取销售发票明细报表信息
 **/
const fetchSaleInvoiceDetailReport = () => ({
    type: constant.FETCH_REPORT_SI_DETAIL
});
const fetchSaleInvoiceDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_SI_DETAIL_SUCCESS,
    data
});
const fetchSaleInvoiceDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_SI_DETAIL_FAILURE,
    error
});


export const asyncFetchSaleInvoiceDetailReport = (params, callback) => dispatch => {
    dispatch(fetchSaleInvoiceDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/saleInvoice/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchSaleInvoiceDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchSaleInvoiceDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchSaleInvoiceDetailReportFailure(error));
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
