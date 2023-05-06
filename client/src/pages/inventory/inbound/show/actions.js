import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const fetchBillNoDetailSuccess = (data) => ({
    type: constant.INBOUND_ORDER_SHOW_GET_LIST,
    data
});

const asyncOperationLogSuccess = (data) => ({
    type: constant.ASYNC_OPERATION_LOG_SUCCESS,
    data
});


export const asyncBillNoShow = (billNo, callback) => dispatch => {
    axios.get(`${BASE_URL}/inventory/in/detail/${billNo}/show`).then(function(res) {
        if(res.data.retCode === 0){
            dispatch(fetchBillNoDetailSuccess(fromJS(res.data)));
            console.log('resData',res.data);
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

//反审批操作
export const asyncUnApproved = (billNo, callback) => dispatch => {
    axios.post(`${BASE_URL}/inventory/in/approve/counter/single`,{billNo:billNo}).then(function(res) {
        console.log('resData',res.data);
        if(res.data.retCode === "0"){
           //操作成功重新载入页面
           callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

//审批操作
export const asyncApproved = (billNo, updatedTime,callback) => dispatch => {
    axios.post(`${BASE_URL}/inventory/in/approve/single`,{billNo:billNo,updatedTime:updatedTime}).then(function(res) {
        if(res.data.retCode === "0"){
            console.log('resData',res.data);
            //操作成功重新载入页面
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

//审批操作日志
export const asyncOperationLog = (billNo, callback) => dispatch => {
    axios.get(`${BASE_URL}/inventory/in/approve/log/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            let { logWarehouseEnterList } = res.data;
            console.log(logWarehouseEnterList, 'logWarehouseEnterList')
            dispatch(asyncOperationLogSuccess(fromJS(logWarehouseEnterList)));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

