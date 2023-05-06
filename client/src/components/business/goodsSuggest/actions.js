import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 物品联想选择
 **/
export const fetchGoodsByValRequest = () => ({
    type: constant.FETCH_GOODS_BY_VAL_REQUEST
});

export const fetchGoodsByValSuccess = (data) => ({
    type: constant.FETCH_GOODS_BY_VAL_SUCCESS,
    data
});

export const fetchGoodsByValFailure = (error) => ({
    type: constant.FETCH_GOODS_BY_VAL_FAILURE,
    error
});

let timeout;
let currentValue;
export const asyncFetchGoodsByVal = (value, fieldType, goodsPopCondition, callback) => dispatch => {

    dispatch(fetchGoodsByValRequest());

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake(){
        axios.get(`${BASE_URL}/goods/search/by/field`, {
            params: {
                field: fieldType,
                searchType: 'like',
                key: value,
                ...goodsPopCondition
            }
        }).then(function(res) {
            if (res.data) {
                dispatch(fetchGoodsByValSuccess(fromJS(res.data)));
                callback && callback(fromJS(res.data.data));
            }
        }).catch(error => {
            dispatch(fetchGoodsByValFailure(error));
        });
    }

    timeout = setTimeout(fake, 300);

};











