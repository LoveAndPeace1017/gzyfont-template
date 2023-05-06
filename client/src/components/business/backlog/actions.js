import axios from 'utils/axios';
import * as constant from "./actionsTypes";

// 列表
export const asyncFetchBacklog =(params)=>({
    actionTypePrefix: constant.ASYNC_FETCH_BACKLOG,
    request: axios.get(`${BASE_URL}/common/backlog/list`, {params}),
});


// 新增记录
export const asyncAddBacklog =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_ADD_BACKLOG,
    request: axios.post(`${BASE_URL}/common/backlog/add`, params),
    callback
});

// 删除记录
export const asyncDeleteBacklog =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_DELETE_BACKLOG,
    request: axios.post(`${BASE_URL}/common/backlog/delete`, params),
    callback
});