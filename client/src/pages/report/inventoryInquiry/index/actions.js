import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchInventoryInquiryReport = () => ({
    type: constant.FETCH_REPORT_INVENTORY_INQUIRY
});
const fetchInventoryInquiryReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_INVENTORY_INQUIRY_SUCCESS,
    data
});
const fetchInventoryInquiryReportFailure = (error) => ({
    type: constant.FETCH_REPORT_INVENTORY_INQUIRY_FAILURE,
    error
});


export const asyncFetchInventoryInquiryReport = (params, callback) => dispatch => {
    dispatch(fetchInventoryInquiryReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/inventoryInquiry/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchInventoryInquiryReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchInventoryInquiryReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchInventoryInquiryReportFailure(error));
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
// export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);

export const asyncBatchUpdateConfig = (arr,callback) => dispatch => {
    axios.post(`${BASE_URL}/common/field/edit`, {
        voList: arr
    }).then(function (res) {
        callback&&callback();
    }).catch(error => {
        alert(error);
    });
};