import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购入库汇总信息
 **/
const fetchOrderInDetailReport = () => ({
    type: constant.FETCH_REPORT_ORDERIN_DETAIL
});
const fetchOrderInDetailReportSuccess = (data) => ({
    type: constant.FETCH_REPORT_ORDERIN_DETAIL_SUCCESS,
    data
});
const fetchOrderInDetailReportFailure = (error) => ({
    type: constant.FETCH_REPORT_ORDERIN_DETAIL_FAILURE,
    error
});


export const asyncFetchOrderInDetailReport = (params, callback) => dispatch => {
    dispatch(fetchOrderInDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/check_supplier/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchOrderInDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchOrderInDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchOrderInDetailReportFailure(error));
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
