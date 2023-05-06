import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购入库汇总信息
 **/
const fetchWareSummaryReport = () => ({
    type: constant.FETCH_REPORT_WARE_SUMMARY
});
const fetchWareSummaryReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_WARE_SUMMARY_SUCCESS,
    data
});
const fetchWareSummaryReportFailure = (error) => ({
    type: constant.FETCH_REPORT_WARE_SUMMARY_FAILURE,
    error
});


export const asyncFetchWareSummaryReport = (params, callback) => dispatch => {
    dispatch(fetchWareSummaryReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/waresum/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchWareSummaryReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchWareSummaryReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchWareSummaryReportFailure(error));
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
