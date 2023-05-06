import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 领用出库汇总表
 **/

export const asyncFetchCollectionAndDeliveryDetailReport=(params, callback)=>({
    actionTypePrefix: constant.FETCH_COLLECTION_DELIVERY,
    request: axios.post(`${BASE_URL}/report/collectionAndDelivery/detail`, params),
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
