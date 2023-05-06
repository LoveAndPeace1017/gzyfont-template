import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

/**
 * 获取物品毛利润信息
 **/
const fetchGrossProfitDetailReport = () => ({
    type: constant.FETCH_REPORT_GROSS_PROFIT_DETAIL
});
const fetchGrossProfitDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_GROSS_PROFIT_DETAIL_SUCCESS,
    data
});
const fetchGrossProfitDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_GROSS_PROFIT_DETAIL_FAILURE,
    error
});


export const asyncFetchGrossProfitDetailReport = (params, callback) => dispatch => {
    dispatch(fetchGrossProfitDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/grossProfit/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchGrossProfitDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchGrossProfitDetailReportFailure(res.data.retMsg));
            }
            if (callback) {
                callback(res.data);
            }
        }).catch(error => {
        dispatch(fetchGrossProfitDetailReportFailure(error));
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
