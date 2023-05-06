import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const userIdEnc = 'guUeyJzBXiOs';

const fetchOnlineOrderCartInitCartList = () => ({
    type: constant.FETCH_ONLINE_ORDER_CART_INIT_CART_LIST
});

const fetchOnlineOrderCartInvalidDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_GET_INVALID_DATA_SUCCESS,
    data
});

const fetchOnlineOrderCartInvalidDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_GET_INVALID_DATA_FAILURE,
    error
});

export const fetchOnlineOrderCartClickOneList = (comIndex, prodIndex) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_CLICK_ONE_LIST,
    comIndex,
    prodIndex
});

export const fetchOnlineOrderCartClickAllList = (comIndex) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_CLICK_All_LIST,
    comIndex
});

export const fetchOnlineOrderCartClickTotalList = (comIndex) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_CLICK_TOTAL_LIST,
    comIndex
});

const fetchOnlineOrderCartChangeAmount = (val, prodIndex, comIndex) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_CHANGE_AMOUNT,
    val,
    prodIndex,
    comIndex
});


//修改购买数量
export const asyncFetchModifyCartAmount = (type, value, prodIndex, comIndex) => dispatch => {
    let url = `${BASE_URL}/mobile/cart/oprate/${type}`;

    axios.post(url, value).then(res => {
        if (res.data.retCode === '0') {
            dispatch(fetchOnlineOrderCartChangeAmount(value[0].quantity, prodIndex, comIndex));
        }else {
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(fetchOnlineOrderCartInvalidDataFailure(error));
    })
};

//初始化购物车列表数据
export const asyncFetchCartData = (params,callback) => dispatch => {
    dispatch(fetchOnlineOrderCartInitCartList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/mobile/cart`).then(function(res) {
        var cartData = {};
        cartData.groups =  res.data.data[0];
        cartData.disabled =  res.data.data[1];
        cartData.chooseTotalFlag = false;
        cartData.groups && cartData.groups.map(function (item) {
            item.chooseAllFlag = 1;
            item.items.map(function (list) {
                list.flag = false;
            })
        })
        dispatch(fetchOnlineOrderCartInvalidDataSuccess(fromJS(cartData)));
    }).catch(error => {
        dispatch(fetchOnlineOrderCartInvalidDataFailure(error));
    });
};

//删除购物车列表数据等操作
export const fetchOnlineOrderCartEditCartData = (type, values, callback) => dispatch => {
    dispatch(fetchOnlineOrderCartInitCartList());
    let url = `${BASE_URL}/mobile/cart/oprate/${type}`;
    axios.post(url, values).then(res => {
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchOnlineOrderCartInvalidDataFailure(error));
    })
};

//清空失效商品
export const fetchOnlineOrderCartClearValidData = (callback) => dispatch => {
    dispatch(fetchOnlineOrderCartInitCartList());
    let url = `${BASE_URL}/mobile/cart/clear`;
    axios.post(url).then(res => {
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchOnlineOrderCartInvalidDataFailure(error));
    })
};

