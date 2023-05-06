import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchFinanceInOutDetailReport = () => ({
    type: constant.FETCH_REPORT_FIO_DETAIL
});
const fetchFinanceInOutDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_FIO_DETAIL_SUCCESS,
    data
});
const fetchFinanceInOutDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_FIO_DETAIL_FAILURE,
    error
});


export const asyncFetchFinanceInOutDetailReport = (params, callback) => dispatch => {
    dispatch(fetchFinanceInOutDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/financeInOut/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchFinanceInOutDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchFinanceInOutDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchFinanceInOutDetailReportFailure(error));
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