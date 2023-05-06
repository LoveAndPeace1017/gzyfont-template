import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const fetchOnlineOrderCarListGetListDataSuccess = (data) => ({
    type: constant.FETCH_NEW_ONLINE_ORDER_CART_LIST_GET_LIST_DATA_SUCCESS,
    data
});

export const asyncFetchNewOnlineOrderListData = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/mobile/newOrderList/list`, {params}).then(function(res) {
        console.log(res,'moblie');
        if(res.data.retCode === '0') {
            dispatch(fetchOnlineOrderCarListGetListDataSuccess(res.data));
            callback && callback();
        }
    }).catch(error => {
        alert(error);
    });
};

export const fetchMobileInfo = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/mobile/info`, {params}).then(function(res) {
        callback && callback();
    }).catch(error => {
        alert(error);
    });
};

const fetchOnlineOrderCartHomeGetCount = (count) => ({
    type: constant.FETCH_MOBILE_CART_NUM,
    count
});
//获取购物车总数
export const asyncFetchCartCount = (callback) => dispatch => {
    let url = `${BASE_URL}/mobile/cart/total`;
    axios.get(url).then(res => {
        if(res.data.retCode === '0'){
            dispatch(fetchOnlineOrderCartHomeGetCount(res.data.data));
            callback && callback(res);
        }
    }).catch(error => {
        alert(error)
    })
};




