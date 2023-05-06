import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取数据精度列表
 **/
export const asyncFetchDataProgressList =(callback) =>({
    actionTypePrefix: constant.FETCH_DATA_PROGRESS_LIST,
    request: axios.get(`${BASE_URL}/auxiliary/accuracy/lists`),
    callback
});

/**
 *  修改数据精度
 */
export const asyncModifyDataProgress =(params, callback) =>({
    actionTypePrefix: constant.FETCH_MODIFY_DATA_PROGRESS,
    request: axios.post(`${BASE_URL}/auxiliary/accuracy`, params),
    callback
});