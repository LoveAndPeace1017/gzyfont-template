import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchInventoryPriceUntaxDetailReport = () => ({
    type: constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_UN_TAX
});
const fetchInventoryPriceUntaxDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_UN_TAX_SUCCESS,
    data
});
const fetchInventoryPriceUntaxDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_UN_TAX_FAILURE,
    error
});


export const asyncFetchInventoryPriceUntaxDetailReport = (params, callback) => dispatch => {
    dispatch(fetchInventoryPriceUntaxDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/inventoryPriceUntax/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchInventoryPriceUntaxDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchInventoryPriceUntaxDetailReportFailure(res.data.retMsg));
            }
        }).catch(error => {
        dispatch(fetchInventoryPriceUntaxDetailReportFailure(error));
    });
};

export const asyncFetchInventoryPriceUntaxDetailTaskReport = (params, callback) => dispatch => {
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/downloadCenter/report/inventoryPriceUntax/`, params)
        .then(function (res) {
            if (res.data) {
                callback && callback(res.data)
            }
        }).catch(error => {

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
