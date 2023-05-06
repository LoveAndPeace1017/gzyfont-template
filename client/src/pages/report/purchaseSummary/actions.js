import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchPurchaseSummaryDetailReport = () => ({
    type: constant.FETCH_REPORT_PURCHASE_SUMMARY_DETAIL
});
const fetchPurchaseSummaryDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_PURCHASE_SUMMARY_DETAIL_SUCCESS,
    data
});
const fetchPurchaseSummaryDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_PURCHASE_SUMMARY_DETAIL_FAILURE,
    error
});


export const asyncFetchPurchaseSummaryDetailReport = (params, callback) => dispatch => {
    dispatch(fetchPurchaseSummaryDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/purchaseSummary/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchPurchaseSummaryDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchPurchaseSummaryDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchPurchaseSummaryDetailReportFailure(error));
        });
};

