import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购及退货统计表信息
 **/

export const asyncFetchPurchaseRefundSummaryByProdDetailReport=(params, callback)=>({
    actionTypePrefix: constant.FETCH_PURCHASE_REFUND_SUMMARY_BY_PROD,
    request: axios.post(`${BASE_URL}/report/purchaseRefundSummaryByProd/detail`, params),
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
