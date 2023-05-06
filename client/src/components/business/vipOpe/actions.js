import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';


/**
 * 开通商城
 **/
const fetchOpenMallRequest = () => ({
    type: constant.FETCH_OPEN_MALL_REQUEST
});

const fetchOpenMallSuccess = (data) => ({
    type: constant.FETCH_OPEN_MALL_SUCCESS,
    data
});

const fetchOpenMallFailure = (error) => ({
    type: constant.FETCH_OPEN_MALL_FAILURE,
    error
});

export const asyncFetchOpenMall = (values, callback) => dispatch => {

    dispatch(fetchOpenMallRequest());
    axios.post(`${BASE_URL}/mall/openMall`, values).then(function (res) {
        if (res.data) {
            dispatch(fetchOpenMallSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchOpenMallFailure(error));
    });
};

//OSS系统VIP服务用户（增值包）添加一条开通记录且开通试用
// 只需通知后台，无需返回，不需要转圈加载
export const asyncOpenVipAndSendRequestToOss = (params, callback) => dispatch => {
    axios.post(`/api/common/asyncOpenVipAndSendRequestToOss`, params).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};