import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购入库汇总信息
 **/
const fetchSaleOutDetailReport = () => ({
    type: constant.FETCH_REPORT_SALEOUT_DETAIL
});
const fetchSaleOutDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_SALEOUT_DETAIL_SUCCESS,
    data
});
const fetchSaleOutDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_SALEOUT_DETAIL_FAILURE,
    error
});


export const asyncFetchSaleOutDetailReport = (params, callback) => dispatch => {
    dispatch(fetchSaleOutDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/check_customer/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchSaleOutDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchSaleOutDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchSaleOutDetailReportFailure(error));
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
