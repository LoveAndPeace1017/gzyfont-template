import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

const fetchTradeSaleProfitDetailReport = () => ({
    type: constant.FETCH_TRADE_SALE_PROFIT_DETAIL
});
const fetchTradeSaleProfitDetailReportSuccess = (data) => ({
    type: constant.FETCH_TRADE_SALE_PROFIT_DETAIL_SUCCESS,
    data
});
const fetchTradeSaleProfitDetailReportFailure = (error) => ({
    type: constant.FETCH_TRADE_SALE_PROFIT_DETAIL_FAILURE,
    error
});


export const asyncFetchTradeSaleProfitDetailReport = (params, callback) => dispatch => {
    dispatch(fetchTradeSaleProfitDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/tradeSaleProfit/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchTradeSaleProfitDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchTradeSaleProfitDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchTradeSaleProfitDetailReportFailure(error));
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
