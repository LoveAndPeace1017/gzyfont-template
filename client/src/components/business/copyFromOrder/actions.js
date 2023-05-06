import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 根据销售单id获取销售单信息
 **/
export const fetchSaleByIdRequest = () => ({
    type: constant.FETCH_SALE_BY_ID_REQUEST
});

export const fetchSaleByIdSuccess = (data) => ({
    type: constant.FETCH_SALE_BY_ID_SUCCESS,
    data
});

export const fetchSaleByIdFailure = (error) => ({
    type: constant.FETCH_SALE_BY_ID_FAILURE,
    error
});

export const asyncFetchSaleById = (id, callback) => dispatch => {

    dispatch(fetchSaleByIdRequest());
    //这边这个接口是从销售订单复制那边弄过来的，做的时候要修改
    axios.get(`${BASE_URL}/purchase/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchSaleByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSaleByIdFailure(error));
    });
};











