import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const fetchOnlineOrderCustomerInitData = ()=>({
    type: constant.FETCH_ONLINE_ORDER_CUSTOMER_INIT_DATA
})
const fetchOnlineOrderCustomerDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_CUSTOMER_GET_LIST_DATA_SUCCESS,
    data
});
const fetchOnlineOrderCustomerDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_CUSTOMER_DATA_FAILURE,
    error
});
const fetchOnlineOrderCartCustomerGetCount = (count) => ({
    type: constant.FETCH_ONLINE_ORDER_CUSTOMER_GET_COUNT,
    count
});

//初始化主页列表数据
export const asyncFetchCustomerData = (params) => dispatch => {
    let url = `${BASE_URL}/onlineOrder/onlineOrderHome/companyIntroduce`;
    axios.post(url,params).then(res => {
        dispatch(fetchOnlineOrderCustomerDataSuccess(res));
        console.log(res,'companys');
    }).catch(error => {

    })
};
//初始化购物车数量
export const asyncFetchCustomerAmount = (params) => dispatch => {
    dispatch(fetchOnlineOrderCartCustomerGetCount(params.amount));
};






