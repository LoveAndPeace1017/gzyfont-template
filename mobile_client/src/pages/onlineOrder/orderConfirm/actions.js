import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const userIdEnc = 'guUeyJzBXiOs';

const fetchOnlineOrderCartGetDetailData = () => ({
    type: constant.FETCH_ONLINE_ORDER_CART_GET_DETAIL_DATA
});

const fetchOnlineOrderCartDetailGetDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_DETAIL_GET_DATA_SUCCESS,
    data
});

const fetchOnlineOrderCartDetailGetDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_CART_DETAIL_GET_DATA_FAILURE,
    error
});


export const asyncFetchCartDetailData = (params,callback) => dispatch => {
    dispatch(fetchOnlineOrderCartGetDetailData());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }

    let url = `${BASE_URL}/mobile/cartOrder/list`;
    axios.post(url, params).then(res => {
        console.log(res,'resss');
        dispatch(fetchOnlineOrderCartDetailGetDataSuccess(fromJS(res.data.data)));
        callback && callback(res.data.data);
    }).catch(error => {
        dispatch(fetchOnlineOrderCartDetailGetDataFailure(error));
    });

};

export const asyncFetchSubmitCartData =  (params,callback) => dispatch => {
    dispatch(fetchOnlineOrderCartGetDetailData());
    let url = `${BASE_URL}/mobile/cartOrder/submit`;
    axios.post(url, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchOnlineOrderCartDetailGetDataFailure(error));
    });
};