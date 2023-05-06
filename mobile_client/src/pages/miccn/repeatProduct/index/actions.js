import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

// 初始化一键重发列表
export const asyncFetchRepeatProduct=(params, callback)=>({
    actionTypePrefix: constant.FETCH_REPEAT_PRODUCT,
    request: axios.get(`${BASE_URL}/mobile/miccn/repeatProduct/list`, {params}),
    callback
});

// 一键重发
export const asyncOneKeyReSubmit=(params, callback)=>({
    actionTypePrefix: constant.FETCH_ONE_KEY_SUBMIT,
    request: axios.post(`${BASE_URL}/mobile/miccn/repeatProduct/resubmit`, params),
    callback
});