import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取销售及退货汇总表信息
 **/

export const asyncFetchSaleRefundSummaryByProdDetailReport=(params, callback)=>({
    actionTypePrefix: constant.FETCH_SALE_REFUND_SUMMARY_BY_PROD,
    request: axios.post(`${BASE_URL}/report/saleRefundSummaryByProd/detail`, params),
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
