import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';


/**
 * 获取采购明细报表信息
 **/
const fetchInventoryDetailReport = () => ({
    type: constant.FETCH_REPORT_INVENTORY_DETAIL
});
const fetchInventoryDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_INVENTORY_DETAIL_SUCCESS,
    data
});
const fetchInventoryDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_INVENTORY_DETAIL_FAILURE,
    error
});


export const asyncFetchInventoryDetailReport = (params, callback) => dispatch => {
    dispatch(fetchInventoryDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/inventory/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchInventoryDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchInventoryDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchInventoryDetailReportFailure(error));
        });
};


export const asyncFetchBusinessType =(params, callback)=>({
    actionTypePrefix: constant.FETCH_BUSINESS_TYPE,
    request: axios.get(`${BASE_URL}/report/inventory/ware/business/type`),
    callback
});

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


