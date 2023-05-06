import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";
import {asyncFetchOperationLogSuccess} from "../../../sale/add/actions"

/**
 * 获取操作日志
 **/
const asyncFetchOperationLogRequest = () => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_REQUEST
});


const asyncFetchOperationLogFailure = (error) => ({
    type: constant.ASYNC_FETCH_OPERATION_LOG_FAILURE,
    error
});


//审批操作日志
export const asyncFetchOperationLog = (billNo, callback) => dispatch => {
    dispatch(asyncFetchOperationLogRequest());
    axios.get(`${BASE_URL}/finance/saleinvoices/approve/log/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            let { logList } = res.data;
            dispatch(asyncFetchOperationLogSuccess(fromJS(logList)));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(asyncFetchOperationLogFailure());
        alert(error);
    });
};


