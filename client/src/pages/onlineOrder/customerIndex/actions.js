import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const fetchOnlineOrderHomeIndexListInitData = ()=>({
    type: constant.FETCH_ONLINE_ORDER_HOME_INDEX_LIST_INIT_DATA
})
const fetchOnlineOrderHomeIndexListDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_HOME_INDEX_LIST_GET_LIST_DATA_SUCCESS,
    data
});
const fetchOnlineOrderHomeIndexListDataFailure = (error) => ({
    type: constant.FETCH_ONLINE_ORDER_HOME_INDEX_LIST_DATA_FAILURE,
    error
});
const fetchOnlineOrderCartHomeGetCount = (count) => ({
    type: constant.FETCH_ONLINE_ORDER_HOME_INDEX_LIST_GET_COUNT,
    count
});

//初始化主页列表数据
export const asyncFetchHomeIndexData = (params) => dispatch => {
    let id = params.id;
    let url = `${BASE_URL}/onlineOrder/onlineOrderHome/index`;
    axios.post(url,{id:id}).then(res => {
        if(res.data.retCode == 0){
            dispatch(fetchOnlineOrderHomeIndexListDataSuccess(res));
        }else{

        }
        console.log(res,'resss');
    }).catch(error => {

    })
};






