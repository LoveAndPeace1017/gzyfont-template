import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const fetchRequisitionOrderDetailSuccess = (data) => ({
    type: constant.REQUISITION_ORDER_SHOW_GET_LIST,
    data
});

const asyncOperationLogSuccess = (data) => ({
    type: constant.ASYNC_OPERATION_LOG_SUCCESS,
    data
});


export const asyncRequisitionOrderShow = (billNo, callback) => dispatch => {
    axios.get(`${BASE_URL}/requisitionOrder/detail/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            dispatch(fetchRequisitionOrderDetailSuccess(fromJS(res.data)));
            console.log('resData',res.data);
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};


//审批操作日志
export const asyncOperationLog = (billNo, callback) => dispatch => {
    axios.get(`${BASE_URL}/requisitionOrder/approve/log/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            let { logRequisitionList } = res.data;
            dispatch(asyncOperationLogSuccess(fromJS(logRequisitionList)));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

