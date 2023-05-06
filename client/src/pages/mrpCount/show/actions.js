import * as constant from "./actionsTypes";
import axios from 'utils/axios';
import {fromJS} from "immutable";


/**
 * 获取操作日志
 **/
const asyncFetchMrpCountDetailRequest = (mrpType) => ({
    type: constant.Mrp_COUNT_DETAIL_REQUEST,
    mrpType
});

const asyncFetchMrpCountDetailSuccess = (data,mrpType) => ({
    type: constant.Mrp_COUNT_DETAIL_SUCCESS,
    data,
    mrpType
});

const asyncFetchMrpCountDetailFailure = (error,mrpType) => ({
    type: constant.Mrp_COUNT_DETAIL_FAILURE,
    error,
    mrpType
});


//获取Mrp详情数据
export const asyncFetchMrpCountDetail = (mrpType,billNo,callback) => dispatch => {
    dispatch(asyncFetchMrpCountDetailRequest(mrpType));
    axios.post(`/api/productControl/mrp/detail`,{mrpType,billNo}).then(function(res) {
        if(res.data.retCode === "0"){
            dispatch(asyncFetchMrpCountDetailSuccess(fromJS(res.data),mrpType));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(asyncFetchMrpCountDetailFailure(mrpType));
        alert(error);
    });
};


