import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";
import {fetchSuggestsByKeySuccess} from "../../../../../client/src/components/business/suggestSearch/actions";

const userIdEnc = 'guUeyJzBXiOs';

const fetchOnlineOrderCartListInitData = () => ({
    type: constant.FETCH_ONLINE_ORDER_CART_LIST_INIT_DATA
});

const fetchOnlineOrderCarListGetGroupDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_LIST_GET_GROUP_DATA_SUCCESS,
    data
});

const fetchOnlineOrderCarListGetListDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_LIST_GET_LIST_DATA_SUCCESS,
    data
});

const fetchOnlineOrderCartListDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_LIST_DATA_FAILURE,
    error
});

const fetchOnlineOrderCartListGetCount = (count) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_LIST_GET_COUNT,
    count
});

const fetchOnlineOrderCartListGetCartAmount = (amount) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_LIST_GET_CART_AMOUNT,
    amount
});

export const fetchOnlineOrderSuggestsByKeySuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_SUGGESTS_BY_KEY_SUCCESS,
    data
});

export const fetchMobileInfo = (params, callback) => dispatch => {
    dispatch(fetchOnlineOrderCartListInitData());

    axios.get(`${BASE_URL}/mobile/info`, {params}).then(function(res) {
        callback && callback();
    }).catch(error => {
        dispatch(fetchOnlineOrderCartListDataFailure(error));
    });
};

export const asyncFetchCartGroupData = (params, callback) => dispatch => {
    dispatch(fetchOnlineOrderCartListInitData());

    axios.get(`${BASE_URL}/mobile/cartList/group`, params).then(function(res) {
        if(res.data.retCode === '0') {
            dispatch(fetchOnlineOrderCarListGetGroupDataSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchOnlineOrderCartListDataFailure(error));
    });
};

//初始化购物车列表数据
export const asyncFetchCartListData = (params, callback) => dispatch => {
    dispatch(fetchOnlineOrderCartListInitData());
    axios.get(`${BASE_URL}/mobile/cartList/list`, {params}).then(function(res) {
        if(res.data.retCode === '0') {
            dispatch(fetchOnlineOrderCarListGetListDataSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchOnlineOrderCartListDataFailure(error));
    });
};

export const changeLocalTotalCount = (params) => dispatch => {
    dispatch(fetchOnlineOrderCartListGetCount(params));
};

export const asyncAddToCart = (type, params, callback) => dispatch => {
    let url = `${BASE_URL}/mobile/cart/oprate/${type}`;
    axios.post(url, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchOnlineOrderCartListDataFailure(error));
    })
};

//获取购物车总数
export const asyncFetchCartCount = (callback) => dispatch => {
    let url = `${BASE_URL}/mobile/cart/total`;
    axios.get(url).then(res => {
        if(res.data.retCode === '0'){
            dispatch(fetchOnlineOrderCartListGetCartAmount(res.data.data));
            callback && callback(res);
        }
    }).catch(error => {
        dispatch(fetchOnlineOrderCartListDataFailure(error));
    })
};

export const asyncOnSearch = (params, callback) => dispatch => {
    let url = `${BASE_URL}/mobile/search/tips`;
    axios.get(url, params).then(res => {
        if(res.data.retCode === '0'){
            dispatch(fetchOnlineOrderSuggestsByKeySuccess(res.data.data));
            callback && callback(res.data.data);
        }
    }).catch(error => {
        dispatch(fetchOnlineOrderCartListDataFailure(error));
    })
};
