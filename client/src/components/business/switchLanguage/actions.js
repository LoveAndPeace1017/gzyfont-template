import axios from 'utils/axios';
import * as constant from "./actionsTypes";

export const asyncFetchLanguageList =()=>({
    actionTypePrefix: constant.ASYNC_FETCH_LANGUAGE_LIST,
    request: axios.get(`${BASE_URL}/vipService/language/list`)
});

// 切换语言
export const asyncSwitchLanguage =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_SWITCH_LANGUAGE,
    request: axios.post(`${BASE_URL}/vipService/language/switch`, params),
    callback
});









