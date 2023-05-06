import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';


/**
 * vip服务
 **/

const fetchVipOrderSuccess = (data) => ({
    type: constant.FETCH_VIP_SERVICE_SUCCESS,
    data
});


export const asyncFetchVipService = (callback) => dispatch => {
    axios.post(`${BASE_URL}/vipService/index`).then(function(res) {
        if (res.data) {
            dispatch(fetchVipOrderSuccess(fromJS(res.data)))
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncFetchVipValueAdded = (callback) => dispatch => {
    axios.post(`${BASE_URL}/vipService/value/added`).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncFetchSwitchLanguage = (params,callback) => dispatch => {
    axios.post(`${BASE_URL}/vipService/language/switch`,params).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

//获取短信提醒的数量
export const asyncFetchGetSmsNotifyNum = (callback) => dispatch => {
    axios.post(`${BASE_URL}/vipService/notify/number`).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};







