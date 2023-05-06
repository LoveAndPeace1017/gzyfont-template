import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


// 获取当前物品单号的批次号列表信息
export const asyncFetchBatchShelfList = (params, callback) => dispatch => {
    let uri = `${BASE_URL}/batchQuery/popup/batchnumber`;
    axios.post(uri, params).then(function(res) {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    });
};













