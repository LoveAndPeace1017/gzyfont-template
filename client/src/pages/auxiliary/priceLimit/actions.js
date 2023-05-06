import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取库存限制列表
 **/
export const asyncFetchPriceLimitList =(params, callback) =>({
    actionTypePrefix: constant.FETCH_PRICE_LIMIT_LIST,
    request: axios.get(`${BASE_URL}/auxiliary/priceLimit/lists`, params),
    callback
});

/**
 *  修改库存超卖 负库存 状态
 */
export const asyncModifyPriceLimitStatus =(params, callback) =>({
    actionTypePrefix: constant.FETCH_MODIFY_PRICE_LIMIT_STATUS,
    request: axios.post(`${BASE_URL}/auxiliary/priceLimit`, params),
    callback
});