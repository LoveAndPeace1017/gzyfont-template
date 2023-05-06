import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

/**
 * 获取物品毛利润信息
 **/
const fetchGrossProfitCustomerDetailReport = () => ({
    type: constant.FETCH_REPORT_GROSS_PROFIT_CUSTOMER_DETAIL
});
const fetchGrossProfitCustomerDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_GROSS_PROFIT_CUSTOMER_DETAIL_SUCCESS,
    data
});
const fetchGrossProfitCustomerDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_GROSS_PROFIT_CUSTOMER_DETAIL_FAILURE,
    error
});


export const asyncFetchGrossProfitCustomerDetailReport = (params, callback) => dispatch => {
    dispatch(fetchGrossProfitCustomerDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/grossProfitCustomer/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchGrossProfitCustomerDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchGrossProfitCustomerDetailReportFailure(res.data.retMsg));
            }
            if (callback) {
                callback(res.data);
            }
        }).catch(error => {
        dispatch(fetchGrossProfitCustomerDetailReportFailure(error));
    });
};

export const asyncFetchGrossProfitCustomerTaskReport = (params, callback) => dispatch => {
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/downloadCenter/report/grossProfitCustomer/`, params)
        .then(function (res) {
            if (res.data) {
                callback && callback(res.data)
            }
        }).catch(error => {

    });
}


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
