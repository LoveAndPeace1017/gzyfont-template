import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取序列号列表信息
 **/

export const asyncFetchSerialNumQueryList=(params, callback)=>({
    actionTypePrefix: constant.FETCH_SERIAL_NUM_QUERY_LIST,
    request: axios.post(`${BASE_URL}/serialNumQuery/list`, params),
    callback
});
