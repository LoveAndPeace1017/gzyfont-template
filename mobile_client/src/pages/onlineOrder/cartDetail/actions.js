import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const userIdEnc = 'guUeyJzBXiOs';

const fetchOnlineOrderCartDetailInitCartData = () => ({
    type: constant.FETCH_ONLINE_ORDER_CART_DETAIL_INIT_CART_DATA
});

const fetchOnlineOrderCartDetailGetDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_DETAIL_GET_DATA_SUCCESS,
    data
});

const fetchOnlineOrderCartDetailGetDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_DETAIL_GET_DATA_FAILURE,
    error
});

//获取详情页数据
export const asyncFetchCartDetailData = (params,callback) => dispatch => {
    dispatch(fetchOnlineOrderCartDetailInitCartData());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }

    let url = `${BASE_URL}/mobile/cartDetail/page`;
    axios.get(url, params).then(res => {
        console.log(res.data,'res');
        dispatch(fetchOnlineOrderCartDetailGetDataSuccess(fromJS(res.data)));
    }).catch(error => {
        dispatch(fetchOnlineOrderCartDetailGetDataFailure(error));
    });
};

//立即订购（主要判断产品是否过期）
export const asyncFetchProductIsUpdata = (params,callback) => dispatch => {
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    let url = `${BASE_URL}/mobile/cartOrder/list`;
    axios.post(url, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    });
};