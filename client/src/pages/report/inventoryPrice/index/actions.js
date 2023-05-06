import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchInventoryPriceDetailReport = () => ({
    type: constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL
});
const fetchInventoryPriceDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_SUCCESS,
    data
});
const fetchInventoryPriceDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_FAILURE,
    error
});


export const asyncFetchInventoryPriceDetailTaskReport = (params, callback) => dispatch => {
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/downloadCenter/report/inventoryPrice/`, params)
        .then(function (res) {
            if (res.data) {
                callback && callback(res.data)
            }
        }).catch(error => {

    });
}


export const asyncFetchInventoryPriceDetailReport = (params, callback) => dispatch => {
    dispatch(fetchInventoryPriceDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/inventoryPrice/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchInventoryPriceDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchInventoryPriceDetailReportFailure(res.data.retMsg));
            }
            if (callback) {
                callback(res.data);
            }
        }).catch(error => {
        dispatch(fetchInventoryPriceDetailReportFailure(error));
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
