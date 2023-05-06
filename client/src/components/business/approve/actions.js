import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


// 获取当前模块单据的审批状态是否开启
export const asyncGetApproveStatus = ({types}, callback) => dispatch => {
    let uri = `${BASE_URL}/approve/getStatus`;
    axios.post(uri, {types}).then(function(res) {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    });
};

// 反驳或提交审批流操作
export const asyncOperateApprove = (params, callback) => dispatch => {
    let uri = `${BASE_URL}/approve/submit`;
    axios.post(uri, params).then(function(res) {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    });
};


// 批量提交审批流操作
export const batchSubmitApprove = (params, callback) => dispatch => {
    let uri = `${BASE_URL}/approve/batch/submit`;
    axios.post(uri, params).then(function(res) {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    });
};













