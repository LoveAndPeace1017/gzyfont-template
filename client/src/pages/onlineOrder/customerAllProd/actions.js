import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const fetchOnlineOrderAllProdListInitData = ()=>({
    type: constant.FETCH_ONLINE_ORDER_ALLPROD_LIST_INIT_DATA
})
const fetchOnlineOrderAllProdListDataSuccess = (data,params) => ({
    type: constant.FETCH_ONLINE_ORDER_ALLPROD_LIST_GET_LIST_DATA_SUCCESS,
    data,
    params
});
const fetchOnlineOrderAllProdListDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_ALLPROD_LIST_DATA_FAILURE,
    error
});
const fetchOnlineOrderCartAllProdGetCount = (count) => ({
    type: constant.FETCH_ONLINE_ORDER_ALLPROD_LIST_GET_COUNT,
    count
});

//初始化主页列表数据
export const asyncFetchCartAllProdData = (params) => dispatch => {
    let url = `${BASE_URL}/onlineOrder/onlineOrderHome/prodAll`;
    axios.post(url,params).then(res => {
        console.log(res,'news');
        dispatch(fetchOnlineOrderAllProdListDataSuccess(res,params));
    }).catch(error => {

    })

};







