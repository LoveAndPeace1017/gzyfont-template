import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取历史追溯报表信息
 **/

export const asyncFetchHistoricalTraceDetailReport=(params)=>({
    actionTypePrefix: constant.FETCH_HISTORICAL_TRACE,
    request: axios.post(`${BASE_URL}/report/historicalTrace/detail`, params)
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
