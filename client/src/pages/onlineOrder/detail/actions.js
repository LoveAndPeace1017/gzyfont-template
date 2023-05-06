import * as constant from './actionsTypes';
import {fromJS} from "immutable";
import axios from 'utils/axios';

/**
 * 根据订单id获取订单详情数据
 **/
export const fetchListByIdRequest = (data) => ({
    type: constant.FETCH_LIST_BY_ID_REQUEST,
    data
});

export const getLoadData = (data) => dispatch => {
    axios.get(`${BASE_URL}/onlineOrder/detail/${data}`).then(function(res) {
        if (res.data) {
            console.log(res.data);
            dispatch(fetchListByIdRequest(fromJS(res.data)));
        }
    });

};