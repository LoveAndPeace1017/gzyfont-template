import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const fetchOnlineOrderHomeListInitData = ()=>({
    type: constant.FETCH_ONLINE_ORDER_HOME_LIST_INIT_DATA
})
const fetchOnlineOrderHomeListDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_HOME_LIST_GET_LIST_DATA_SUCCESS,
    data
});
const fetchOnlineOrderHomeListDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_HOME_LIST_DATA_FAILURE,
    error
});
const fetchOnlineOrderCartHomeGetCount = (count) => ({
    type: constant.FETCH_ONLINE_ORDER_HOME_LIST_GET_COUNT,
    count
});

//初始化主页列表数据
export const asyncFetchCartHomeData = () => dispatch => {
    let url = `${BASE_URL}/onlineOrder/onlineOrderHome/list`;
    axios.post(url).then(res => {
        if(res.data.retCode == 0){
            dispatch(fetchOnlineOrderHomeListDataSuccess(res.data));
        }else{

        }

    }).catch(error => {
        alert(error);
    })
};


export const asyncAddToCart = (type, params, callback) => dispatch => {
    let url = `${BASE_URL}/onlineOrder/cart/oprate/${type}`;
    axios.post(url, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        alert(error)
    })
};

//获取购物车总数
export const asyncFetchCartCount = (callback) => dispatch => {
    let url = `${BASE_URL}/onlineOrder/cart/total`;
    axios.get(url).then(res => {
        if(res.data.retCode === '0'){
            dispatch(fetchOnlineOrderCartHomeGetCount(res.data.data));
            callback && callback(res);
        }
    }).catch(error => {
        alert(error)
    })
};


//初始化购物车数量
export const asyncFetchCartHomeAmount = (params) => dispatch => {
    dispatch(fetchOnlineOrderCartHomeGetCount(params.amount));
};