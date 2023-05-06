import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取物品单位列表
 **/
const fetchDeliveryAddrListRequest = () => ({
    type: constant.FETCH_DELIVERY_ADDR_LIST_REQUEST
});

const fetchDeliveryAddrListSuccess = (data) => ({
    type: constant.FETCH_DELIVERY_ADDR_LIST_SUCCESS,
    data
});

const fetchDeliveryAddrListFailure = (error) => ({
    type: constant.FETCH_DELIVERY_ADDR_LIST_FAILURE,
    error
});

export const asyncFetchDeliveryAddrList = (callback) => dispatch => {
    dispatch(fetchDeliveryAddrListRequest());
    axios.get(`${BASE_URL}/auxiliary/unit/list`).then(function(res) {
        if (res.data) {
            dispatch(fetchDeliveryAddrListSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchDeliveryAddrListFailure(error));
    });
};
