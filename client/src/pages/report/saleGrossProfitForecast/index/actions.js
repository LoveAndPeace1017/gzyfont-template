import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 销售毛利预测表
 **/

export const asyncFetchsaleGrossProfitForecastDetailReport=(params, callback)=>({
    actionTypePrefix: constant.FETCH_SALE_GROSS_PROFIT_FORECAST,
    request: axios.post(`${BASE_URL}/report/saleGrossProfitForecast/detail`, params),
    callback
});

export const asyncFetchSaleGrossProfitForecastTaskReport = (params, callback) => dispatch => {
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/downloadCenter/report/saleGrossProfitForecast/`, params)
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
export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);
