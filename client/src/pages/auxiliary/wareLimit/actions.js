import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取库存限制列表
 **/
export const asyncFetchWareLimitList =(params, callback) =>({
    actionTypePrefix: constant.FETCH_WARE_LIMIT_LIST,
    request: axios.get(`${BASE_URL}/auxiliary/wareLimit/lists`, params),
    callback
});

/**
 *  修改库存超卖 负库存 状态
 */
export const asyncModifyWareLimitStatus =(params, callback) =>({
    actionTypePrefix: constant.FETCH_MODIFY_WARE_LIMIT_STATUS,
    request: axios.post(`${BASE_URL}/auxiliary/wareLimit`, params),
    callback
});