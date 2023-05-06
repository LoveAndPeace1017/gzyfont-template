import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 工单详情
 **/
/**
 * 根据id获取工单信息
 **/
export const fetchProductControlByIdRequest = () => ({
    type: constant.FETCH_PRODUCT_CONTROL_BY_ID_REQUEST
});

export const fetchProductControlByIdSuccess = (data) => ({
    type: constant.FETCH_PRODUCT_CONTROL_BY_ID_SUCCESS,
    data
});

export const fetchProductControlByIdFailure = (error) => ({
    type: constant.FETCH_PRODUCT_CONTROL_BY_ID_FAILURE,
    error
});

export const asyncFetchProductControlById = (id, callback) => dispatch => {
    dispatch(fetchProductControlByIdRequest());
    axios.get(`${BASE_URL}/productControl/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchProductControlByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchProductControlByIdFailure(error));
    });
};

// 工单操作按钮
export const asyncOperateWorksheet=(params,callback)=>({
    actionTypePrefix: constant.ASYNC_OPERATE_WORKSHEET,
    request: axios.post(`${BASE_URL}/productControl/worksheet/operate`, params),
    callback
});


// 工序操作按钮
export const asyncOperateWorksheetProcess=(params,callback)=>({
    actionTypePrefix: constant.ASYNC_OPERATE_WORKSHEET_PROCESS,
    request: axios.post(`${BASE_URL}/productControl/worksheet/process/operate`, params),
    callback
});


// 报工记录列表
export const asyncFetchWorkSheetReport =(params)=>({
    actionTypePrefix: constant.ASYNC_FETCH_WORK_SHEET_REPORT,
    request: axios.get(`${BASE_URL}/productControl/worksheet/report/${params.billNo}`, {params}),
});

// 新增报工记录
export const asyncAddWorkSheetReport =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_ADD_WORK_SHEET_REPORT,
    request: axios.post(`${BASE_URL}/productControl/worksheet/report/add`, params),
    callback
});

// 删除报工记录
export const asyncDeleteWorkSheetReport =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_DELETE_WORK_SHEET_REPORT,
    request: axios.post(`${BASE_URL}/productControl/worksheet/report/delete`, params),
    callback
});

/**
 * 获取操作日志
 **/
export const asyncFetchOperationLog = (billNo)=>({
    actionTypePrefix: constant.ASYNC_FETCH_OPERATION_LOG_REQUEST,
    request: axios.get(`${BASE_URL}/productControl/log/${billNo}`)
});

//质检操作
export const asyncFetchQualityAction = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/productControl/quality`,params).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        console.log(error);
    });
};


// 发送短信提醒
export const asyncMessageRecommend =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_MESSAGE_RECOMMEND,
    request: axios.post(`${BASE_URL}/productControl/sms_notify`, params),
    callback
});
