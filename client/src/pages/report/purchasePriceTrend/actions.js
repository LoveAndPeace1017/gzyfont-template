import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购价格走势图
 **/
const fetchPurchasePriceTrendDetailReport = () => ({
    type: constant.FETCH_REPORT_PURCHASE_PRICE_TREND_DETAIL
});
const fetchPurchasePriceTrendDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_PURCHASE_PRICE_TREND_SUCCESS,
    data
});
const fetchPurchasePriceTrendDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_PURCHASE_PRICE_TREND_FAILURE,
    error
});


export const asyncFetchPurchasePriceTrendDetailReport = (params, callback) => dispatch => {
    dispatch(fetchPurchasePriceTrendDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/purchasePriceTrend/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchPurchasePriceTrendDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchPurchasePriceTrendDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchPurchasePriceTrendDetailReportFailure(error));
        });
};

