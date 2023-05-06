import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchSaleSummaryDetailReport = () => ({
    type: constant.FETCH_REPORT_SALE_SUMMARY_DETAIL
});
const fetchSaleSummaryDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_SALE_SUMMARY_DETAIL_SUCCESS,
    data
});
const fetchSaleSummaryDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_SALE_SUMMARY_DETAIL_FAILURE,
    error
});


export const asyncFetchSaleSummaryDetailReport = (params, callback) => dispatch => {
    dispatch(fetchSaleSummaryDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/saleSummary/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchSaleSummaryDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchSaleSummaryDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchSaleSummaryDetailReportFailure(error));
        });
};

