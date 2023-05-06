import axios from 'utils/axios';
import * as constant from "./actionsTypes";

//获取工作时间列表
export const asyncFetchWorkTime =(callback) =>({
    actionTypePrefix: constant.FETCH_WORK_TIME_LIST,
    request: axios.get(`${BASE_URL}/auxiliary/workcenter/timeList`),
    callback
});

//更新工作时间
export const asyncUpdateWorkTime =(params, callback) =>({
    actionTypePrefix: constant.FETCH_WORK_TIME_UPDATE,
    request: axios.get(`${BASE_URL}/auxiliary/workcenter/time`,{params}),
    callback
});


