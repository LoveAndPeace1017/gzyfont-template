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

export const asyncFetchSaleById = (id, unitPriceSource, callback) => dispatch => {

    dispatch(fetchSaleByIdRequest());
    let url;
    if(unitPriceSource === 'orderPrice'){
        url = `${BASE_URL}/sale/${id}/purchase/pre/create`;
    }else{
        url = `${BASE_URL}/sale/detail/${id}`;
    }
    axios.get(url).then(function(res) {
        if (res.data) {
            dispatch(fetchSaleByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSaleByIdFailure(error));
    });
};











